"use strict";

exports.__esModule = true;
exports.resolveFundingEligibility = resolveFundingEligibility;

var _sdkConstants = require("@paypal/sdk-constants");

var _strictMerge = require("strict-merge");

var _lib = require("../lib");

var _config = require("../config");

function buildFundingEligibilityQuery(basicFundingEligibility) {
  const InputTypes = {
    $clientID: 'String',
    $buyerCountry: 'CountryCodes',
    $ip: 'String',
    $cookies: 'String',
    $currency: 'SupportedCountryCurrencies',
    $intent: 'FundingEligibilityIntent',
    $commit: 'Boolean',
    $vault: 'Boolean',
    $enableFunding: '[ SupportedPaymentMethodsType ]',
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
    enableFunding: '$enableFunding',
    disableFunding: '$disableFunding',
    disableCard: '$disableCard',
    merchantId: '$merchantID',
    buttonSessionId: '$buttonSessionID',
    userAgent: '$userAgent'
  };

  const getBasicFundingEligibilityQuery = () => {
    return {
      eligible: _lib.graphqlTypes.boolean
    };
  };

  const getCardVendorQuery = () => {
    return {
      eligible: _lib.graphqlTypes.boolean
    };
  };

  const getCardVendorsQuery = () => {
    return {
      [_sdkConstants.CARD.VISA]: getCardVendorQuery(),
      [_sdkConstants.CARD.MASTERCARD]: getCardVendorQuery(),
      [_sdkConstants.CARD.AMEX]: getCardVendorQuery(),
      [_sdkConstants.CARD.DISCOVER]: getCardVendorQuery(),
      [_sdkConstants.CARD.HIPER]: getCardVendorQuery(),
      [_sdkConstants.CARD.ELO]: getCardVendorQuery(),
      [_sdkConstants.CARD.JCB]: getCardVendorQuery()
    };
  };

  const getPayLaterProductQuery = () => {
    return {
      eligible: _lib.graphqlTypes.boolean,
      variant: _lib.graphqlTypes.string
    };
  };

  const getPayLaterProductsQuery = () => {
    return {
      payIn4: getPayLaterProductQuery(),
      paylater: getPayLaterProductQuery()
    };
  };

  const getPayPalQuery = () => {
    return {
      eligible: _lib.graphqlTypes.boolean
    };
  };

  const getCardQuery = () => {
    return {
      eligible: _lib.graphqlTypes.boolean,
      branded: _lib.graphqlTypes.boolean,
      installments: _lib.graphqlTypes.boolean,
      vendors: getCardVendorsQuery()
    };
  };

  const getPayLaterQuery = () => {
    return {
      eligible: _lib.graphqlTypes.boolean,
      products: getPayLaterProductsQuery()
    };
  };

  const fundingQuery = {
    [_sdkConstants.FUNDING.PAYPAL]: getPayPalQuery(),
    [_sdkConstants.FUNDING.CARD]: getCardQuery(),
    [_sdkConstants.FUNDING.VENMO]: getBasicFundingEligibilityQuery(),
    [_sdkConstants.FUNDING.ITAU]: getBasicFundingEligibilityQuery(),
    [_sdkConstants.FUNDING.CREDIT]: getBasicFundingEligibilityQuery(),
    [_sdkConstants.FUNDING.PAYLATER]: getPayLaterQuery(),
    [_sdkConstants.FUNDING.SEPA]: getBasicFundingEligibilityQuery(),
    [_sdkConstants.FUNDING.IDEAL]: getBasicFundingEligibilityQuery(),
    [_sdkConstants.FUNDING.BANCONTACT]: getBasicFundingEligibilityQuery(),
    [_sdkConstants.FUNDING.GIROPAY]: getBasicFundingEligibilityQuery(),
    [_sdkConstants.FUNDING.EPS]: getBasicFundingEligibilityQuery(),
    [_sdkConstants.FUNDING.SOFORT]: getBasicFundingEligibilityQuery(),
    [_sdkConstants.FUNDING.MYBANK]: getBasicFundingEligibilityQuery(),
    [_sdkConstants.FUNDING.P24]: getBasicFundingEligibilityQuery(),
    [_sdkConstants.FUNDING.ZIMPLER]: getBasicFundingEligibilityQuery(),
    [_sdkConstants.FUNDING.WECHATPAY]: getBasicFundingEligibilityQuery(),
    [_sdkConstants.FUNDING.PAYU]: getBasicFundingEligibilityQuery(),
    [_sdkConstants.FUNDING.BLIK]: getBasicFundingEligibilityQuery(),
    [_sdkConstants.FUNDING.TRUSTLY]: getBasicFundingEligibilityQuery(),
    [_sdkConstants.FUNDING.OXXO]: getBasicFundingEligibilityQuery(),
    [_sdkConstants.FUNDING.MAXIMA]: getBasicFundingEligibilityQuery(),
    [_sdkConstants.FUNDING.BOLETO]: getBasicFundingEligibilityQuery(),
    [_sdkConstants.FUNDING.MERCADOPAGO]: getBasicFundingEligibilityQuery()
  };
  return (0, _lib.buildQuery)({
    name: 'GetFundingEligibility',
    key: 'fundingEligibility',
    inputTypes: InputTypes,
    inputs: Inputs,
    query: (0, _lib.pruneQuery)(fundingQuery, basicFundingEligibility)
  });
}

async function resolveFundingEligibility(req, gqlBatch, {
  logger,
  clientID,
  merchantID,
  buttonSessionID,
  currency,
  intent,
  commit,
  vault,
  enableFunding = [],
  disableFunding = [],
  disableCard = [],
  clientAccessToken,
  buyerCountry,
  basicFundingEligibility
}) {
  try {
    const ip = req.ip;
    const cookies = req.get('cookie') || '';
    const userAgent = req.get('user-agent') || '';
    basicFundingEligibility = (0, _lib.copy)(basicFundingEligibility);

    if (basicFundingEligibility.card && merchantID && merchantID.length > 1) {
      delete basicFundingEligibility.card.branded;
    }

    const fundingEligibilityQuery = buildFundingEligibilityQuery(basicFundingEligibility);

    if (!fundingEligibilityQuery) {
      logger.info(req, 'funding_eligibility_no_queryable_fields');
      return basicFundingEligibility;
    }

    const {
      fundingEligibility
    } = await gqlBatch({
      query: fundingEligibilityQuery,
      variables: {
        clientID,
        merchantID,
        buyerCountry,
        cookies,
        ip,
        currency,
        commit,
        vault,
        userAgent,
        buttonSessionID,
        intent: intent.toUpperCase(),
        disableFunding: disableFunding.map(source => source.toUpperCase()),
        disableCard: disableCard.map(card => card.toUpperCase()),
        enableFunding: enableFunding.map(source => source.toUpperCase())
      },
      accessToken: clientAccessToken,
      timeout: _config.FUNDING_ELIGIBILITY_TIMEOUT
    });
    return (0, _strictMerge.strictMerge)(basicFundingEligibility, fundingEligibility, (first, second) => second);
  } catch (err) {
    if (err.message && err.message.includes(_config.TIMEOUT_ERROR_MESSAGE)) {
      logger.track(req, {
        [_sdkConstants.FPTI_KEY.STATE]: _config.FPTI_STATE.BUTTON,
        [_sdkConstants.FPTI_KEY.TRANSITION]: 'funding_eligibility_promise_timeout',
        [_sdkConstants.FPTI_KEY.CONTEXT_ID]: buttonSessionID,
        [_sdkConstants.FPTI_KEY.CONTEXT_TYPE]: 'button_session_id',
        [_sdkConstants.FPTI_KEY.FEED]: 'payments_sdk'
      }, {});
    }

    logger.error(req, 'funding_eligibility_error_fallback', {
      err: err.stack ? err.stack : err.toString()
    });
    return basicFundingEligibility;
  }
}