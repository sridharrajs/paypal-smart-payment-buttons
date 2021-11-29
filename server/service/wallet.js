"use strict";

exports.__esModule = true;
exports.resolveWallet = resolveWallet;

var _sdkConstants = require("@paypal/sdk-constants");

var _typedGraphqlify = require("typed-graphqlify");

var _belter = require("belter");

var _config = require("../config");

function buildVaultQuery() {
  const InputTypes = {
    $clientID: 'String',
    $buyerCountry: 'CountryCodes',
    $ip: 'String',
    $cookies: 'String',
    $currency: 'SupportedCountryCurrencies',
    $intent: 'FundingEligibilityIntent',
    $commit: 'Boolean',
    $vault: 'Boolean',
    $disableFunding: '[ SupportedPaymentMethodsType ]',
    $disableCard: '[ SupportedCardsType ]',
    $merchantID: '[ String ]',
    $buttonSessionID: 'String',
    $userAgent: 'String'
  };
  const Inputs = {
    clientId: '$clientID',
    buyerCountry: '$buyerCountry',
    ip: '$ip',
    cookies: '$cookies',
    currency: '$currency',
    intent: '$intent',
    commit: '$commit',
    vault: '$vault',
    disableFunding: '$disableFunding',
    disableCard: '$disableCard',
    merchantId: '$merchantID',
    buttonSessionId: '$buttonSessionID',
    userAgent: '$userAgent'
  };

  const getVaultedInstrumentQuery = () => {
    return {
      id: _typedGraphqlify.types.string,
      label: {
        description: _typedGraphqlify.types.string
      }
    };
  };

  const getBasicCardVendorQuery = () => {
    return {
      vaultedInstruments: getVaultedInstrumentQuery()
    };
  };

  const getVendorQuery = () => {
    return {
      [_sdkConstants.CARD.VISA]: getBasicCardVendorQuery(),
      [_sdkConstants.CARD.MASTERCARD]: getBasicCardVendorQuery(),
      [_sdkConstants.CARD.AMEX]: getBasicCardVendorQuery(),
      [_sdkConstants.CARD.DISCOVER]: getBasicCardVendorQuery(),
      [_sdkConstants.CARD.HIPER]: getBasicCardVendorQuery(),
      [_sdkConstants.CARD.ELO]: getBasicCardVendorQuery(),
      [_sdkConstants.CARD.JCB]: getBasicCardVendorQuery()
    };
  };

  const getPayPalQuery = () => {
    return {
      vaultedInstruments: getVaultedInstrumentQuery()
    };
  };

  const getCardQuery = () => {
    return {
      vendors: getVendorQuery()
    };
  };

  const fundingQuery = {
    [_sdkConstants.FUNDING.PAYPAL]: getPayPalQuery(),
    [_sdkConstants.FUNDING.CARD]: getCardQuery()
  };
  return (0, _typedGraphqlify.query)('GetVaultedInstruments', (0, _typedGraphqlify.params)(InputTypes, {
    fundingEligibility: (0, _typedGraphqlify.params)(Inputs, fundingQuery)
  }));
}

function buildSmartWalletQuery() {
  const InputTypes = {
    $clientID: 'String!',
    $merchantID: '[ String! ]',
    $currency: 'String',
    $amount: 'String',
    $userIDToken: 'String',
    $userRefreshToken: 'String',
    $userAccessToken: 'String',
    $vetted: 'Boolean',
    $paymentMethodToken: 'String',
    $branded: 'Boolean',
    $allowBillingPayments: 'Boolean'
  };
  const Inputs = {
    clientId: '$clientID',
    merchantId: '$merchantID',
    currency: '$currency',
    amount: '$amount',
    userIdToken: '$userIDToken',
    userRefreshToken: '$userRefreshToken',
    userAccessToken: '$userAccessToken',
    vetted: '$vetted',
    paymentMethodNonce: '$paymentMethodToken',
    branded: '$branded',
    allowBillingPayments: '$allowBillingPayments'
  };

  const getSmartWalletInstrumentQuery = () => {
    return {
      type: _typedGraphqlify.types.string,
      label: _typedGraphqlify.types.string,
      logoUrl: _typedGraphqlify.types.string,
      instrumentID: _typedGraphqlify.types.string,
      tokenID: _typedGraphqlify.types.string,
      vendor: _typedGraphqlify.types.string,
      oneClick: _typedGraphqlify.types.boolean,
      branded: _typedGraphqlify.types.boolean
    };
  };

  const getSmartWalletFundingQuery = () => {
    return {
      instruments: getSmartWalletInstrumentQuery()
    };
  };

  const fundingQuery = {
    [_sdkConstants.FUNDING.PAYPAL]: getSmartWalletFundingQuery(),
    [_sdkConstants.FUNDING.CREDIT]: getSmartWalletFundingQuery(),
    [_sdkConstants.FUNDING.CARD]: getSmartWalletFundingQuery(),
    [_sdkConstants.FUNDING.VENMO]: getSmartWalletFundingQuery()
  };
  return (0, _typedGraphqlify.query)('GetSmartWallet', (0, _typedGraphqlify.params)(InputTypes, {
    smartWallet: (0, _typedGraphqlify.params)(Inputs, fundingQuery)
  }));
}

const DEFAULT_AMOUNT = '0.00'; // eslint-disable-next-line complexity

async function resolveWallet(req, gqlBatch, {
  logger,
  clientID,
  merchantID,
  buttonSessionID,
  currency,
  intent,
  commit,
  vault,
  disableFunding,
  disableCard,
  clientAccessToken,
  buyerCountry,
  buyerAccessToken,
  amount = DEFAULT_AMOUNT,
  userIDToken,
  userRefreshToken,
  paymentMethodToken,
  branded,
  allowBillingPayments
}) {
  const wallet = {
    paypal: {
      instruments: []
    },
    credit: {
      instruments: []
    },
    card: {
      instruments: []
    },
    venmo: {
      instruments: []
    }
  };

  if (userIDToken || userRefreshToken || buyerAccessToken || paymentMethodToken) {
    try {
      const result = await gqlBatch({
        query: buildSmartWalletQuery(),
        variables: {
          clientID,
          merchantID,
          currency,
          amount,
          userIDToken,
          userRefreshToken,
          buyerAccessToken,
          paymentMethodToken,
          branded,
          vetted: false,
          allowBillingPayments
        },
        accessToken: clientAccessToken,
        timeout: _config.WALLET_TIMEOUT
      });

      if (!result.smartWallet) {
        throw new Error(`No smart wallet returned`);
      }

      return result.smartWallet;
    } catch (err) {
      if (err.message && err.message.includes(_config.TIMEOUT_ERROR_MESSAGE)) {
        logger.track(req, {
          [_sdkConstants.FPTI_KEY.STATE]: _config.FPTI_STATE.BUTTON,
          [_sdkConstants.FPTI_KEY.TRANSITION]: 'wallet_promise_timeout',
          [_sdkConstants.FPTI_KEY.CONTEXT_ID]: buttonSessionID,
          [_sdkConstants.FPTI_KEY.CONTEXT_TYPE]: 'button_session_id',
          [_sdkConstants.FPTI_KEY.FEED]: 'payments_sdk'
        }, {});
      }

      logger.error(req, 'smart_wallet_error_fallback', {
        err: err.stack ? err.stack : err.toString()
      });
      return wallet;
    }
  }

  if (!clientAccessToken && !buyerAccessToken) {
    logger.info(req, 'resolve_wallet_no_recognized_user');
    return wallet;
  }

  logger.info(req, 'resolve_wallet');

  if (clientAccessToken) {
    logger.info(req, 'resolve_wallet_vault');
  }

  if (buyerAccessToken) {
    logger.info(req, 'resolve_wallet_account');
  }

  try {
    const ip = req.ip;
    const cookies = req.get('cookie') || '';
    const userAgent = req.get('user-agent') || '';
    intent = intent ? intent.toUpperCase() : intent; // $FlowFixMe

    disableFunding = disableFunding ? disableFunding.map(source => source.toUpperCase()) : disableFunding; // $FlowFixMe

    disableCard = disableCard ? disableCard.map(source => source.toUpperCase()) : disableCard;
    const fundingElig = clientAccessToken ? await gqlBatch({
      query: buildVaultQuery(),
      variables: {
        clientID,
        merchantID,
        buyerCountry,
        cookies,
        ip,
        currency,
        intent,
        commit,
        vault,
        disableFunding,
        disableCard,
        userAgent,
        buttonSessionID
      },
      accessToken: clientAccessToken,
      timeout: _config.WALLET_TIMEOUT
    }) : null;
    const buyerVault = fundingElig && fundingElig.fundingEligibility;

    if (buyerVault) {
      if (buyerVault && buyerVault.paypal && buyerVault.paypal.vaultedInstruments) {
        for (const vaultedInstrument of buyerVault.paypal.vaultedInstruments) {
          logger.info(req, 'resolve_vault_paypal', {
            oneClick: 'true'
          });
          wallet.paypal.instruments = [...wallet.paypal.instruments, {
            tokenID: vaultedInstrument.id,
            label: vaultedInstrument.label.description,
            oneClick: true,
            branded: true
          }];
        }
      }

      if (buyerVault && buyerVault.card) {
        for (const card of (0, _belter.values)(_sdkConstants.CARD)) {
          const vendorVault = buyerVault.card.vendors[card];

          if (vendorVault && vendorVault.vaultedInstruments) {
            // eslint-disable-next-line max-depth
            for (const vaultedInstrument of vendorVault.vaultedInstruments) {
              logger.info(req, 'resolve_vault_card', {
                oneClick: 'true'
              });
              wallet.card.instruments = [...wallet.card.instruments, {
                type: _sdkConstants.WALLET_INSTRUMENT.CARD,
                vendor: card,
                tokenID: vaultedInstrument.id,
                label: vaultedInstrument.label.description,
                oneClick: true,
                branded: false
              }];
            }
          }
        }
      }
    }

    if (!wallet.paypal.instruments.length && !wallet.card.instruments.length && !wallet.credit.instruments.length) {
      logger.info(req, 'wallet_no_instruments');
    }

    return wallet;
  } catch (err) {
    if (err.message && err.message.includes(_config.TIMEOUT_ERROR_MESSAGE)) {
      logger.track(req, {
        [_sdkConstants.FPTI_KEY.STATE]: _config.FPTI_STATE.BUTTON,
        [_sdkConstants.FPTI_KEY.TRANSITION]: 'wallet_promise_timeout',
        [_sdkConstants.FPTI_KEY.CONTEXT_ID]: buttonSessionID,
        [_sdkConstants.FPTI_KEY.CONTEXT_TYPE]: 'button_session_id',
        [_sdkConstants.FPTI_KEY.FEED]: 'payments_sdk'
      }, {});
    }

    logger.error(req, 'wallet_error_fallback', {
      err: err.stack ? err.stack : err.toString()
    });
    return wallet;
  }
}