"use strict";

exports.__esModule = true;
exports.getAmount = getAmount;
exports.getButtonParams = getButtonParams;
exports.getButtonPreflightParams = getButtonPreflightParams;

var _sdkConstants = require("@paypal/sdk-constants");

var _belter = require("belter");

var _config = require("../../config");

var _lib = require("../../lib");

var _constants = require("./constants");

/* eslint max-depth: off */
function getCookieString(req) {
  try {
    if (!req.cookies) {
      return '';
    }

    return Object.keys(req.cookies).map(key => {
      return `${key}=x;`;
    }).join('');
  } catch (err) {
    return '';
  }
}

const getDefaultFundingEligibility = () => {
  // $FlowFixMe
  return {};
}; // eslint-disable-next-line complexity


function getFundingEligibilityParam(req) {
  const encodedFundingEligibility = req.query.fundingEligibility;

  if (encodedFundingEligibility && typeof encodedFundingEligibility === 'string') {
    let fundingEligibilityInput;

    try {
      fundingEligibilityInput = JSON.parse(Buffer.from(encodedFundingEligibility, 'base64').toString('utf8'));
    } catch (err) {
      throw new _lib.makeError(_sdkConstants.ERROR_CODE.VALIDATION_ERROR, `Invalid funding eligibility: ${encodedFundingEligibility}`, err);
    }

    const fundingEligibility = getDefaultFundingEligibility();

    for (const fundingSource of (0, _belter.values)(_sdkConstants.FUNDING)) {
      const fundingSourceEligibilityInput = fundingEligibilityInput[fundingSource] || {};
      const fundingSourceEligibility = fundingEligibility[fundingSource] = {};

      if (fundingSourceEligibilityInput) {
        if (typeof fundingSourceEligibilityInput.eligible === 'boolean') {
          fundingSourceEligibility.eligible = fundingSourceEligibilityInput.eligible;
        }

        if (typeof fundingSourceEligibilityInput.recommended === 'boolean') {
          fundingSourceEligibility.recommended = fundingSourceEligibilityInput.recommended;
        }

        if (typeof fundingSourceEligibilityInput.branded === 'boolean') {
          fundingSourceEligibility.branded = fundingSourceEligibilityInput.branded;
        }

        if (typeof fundingSourceEligibilityInput.installments === 'boolean') {
          fundingSourceEligibility.installments = fundingSourceEligibilityInput.installments;
        }

        if (typeof fundingSourceEligibilityInput.vaultable === 'boolean') {
          fundingSourceEligibility.vaultable = fundingSourceEligibilityInput.vaultable;
        }

        if (fundingSource === _sdkConstants.FUNDING.CARD) {
          const vendorsInputEligibility = fundingSourceEligibilityInput.vendors || {};
          const vendorsEligility = fundingSourceEligibility.vendors = {};

          for (const vendor of (0, _belter.values)(_sdkConstants.CARD)) {
            const vendorEligibilityInput = vendorsInputEligibility[vendor] || {};
            const vendorEligibility = vendorsEligility[vendor] = {};

            if (typeof vendorEligibilityInput.eligible === 'boolean') {
              vendorEligibility.eligible = vendorEligibilityInput.eligible;
            }

            if (typeof vendorEligibilityInput.branded === 'boolean') {
              vendorEligibility.branded = vendorEligibilityInput.branded;
            }

            if (typeof vendorEligibilityInput.vaultable === 'boolean') {
              vendorEligibility.vaultable = vendorEligibilityInput.vaultable;
            }
          }
        }

        const productsEligibilityInput = fundingSourceEligibilityInput.products;
        const productsEligibility = fundingSourceEligibility.products || {};

        if (productsEligibilityInput) {
          fundingSourceEligibility.products = productsEligibility;

          for (const product of (0, _belter.values)(_sdkConstants.FUNDING_PRODUCTS)) {
            const productEligibilityInput = productsEligibilityInput[product] || {};
            const productEligibility = productsEligibility[product] || {};

            if (typeof productEligibilityInput.eligible === 'boolean') {
              productEligibility.eligible = productEligibilityInput.eligible;
              productsEligibility[product] = productEligibility;
            }

            if (typeof productEligibilityInput.variant === 'string') {
              productEligibility.variant = productEligibilityInput.variant;
              productsEligibility[product] = productEligibility;
            }
          }
        }
      }
    }

    return fundingEligibility;
  }

  return {
    [_sdkConstants.FUNDING.PAYPAL]: {
      eligible: true
    }
  };
}

function getPaymentMethodToken(req) {
  const paymentMethodToken = req.query && (req.query.paymentMethodNonce || req.query.paymentMethodToken);

  if (!paymentMethodToken || typeof paymentMethodToken !== 'string') {
    return;
  }

  return paymentMethodToken;
}

function getBranded(params) {
  const branded = params.branded;

  if (typeof branded !== 'boolean') {
    return;
  }

  return branded;
}

function getRiskDataParam(req) {
  const serializedRiskData = req.query.riskData;

  if (!serializedRiskData || typeof serializedRiskData !== 'string') {
    return;
  }

  try {
    return JSON.parse(Buffer.from(serializedRiskData, 'base64').toString('utf8'));
  } catch (err) {// pass
  }
}

function getBuyerCountry(req, params) {
  return params.buyerCountry || req.get(_config.HTTP_HEADER.PP_GEO_LOC) || _sdkConstants.COUNTRY.US;
}

function getLocale(params) {
  let {
    locale: {
      country = _sdkConstants.DEFAULT_COUNTRY,
      lang
    } = {}
  } = params;
  const langs = _sdkConstants.COUNTRY_LANGS[country];

  if (!langs) {
    throw (0, _lib.makeError)(_sdkConstants.ERROR_CODE.VALIDATION_ERROR, `Invalid locale country: ${country}`);
  }

  lang = lang || langs[0];

  if (langs.indexOf(lang) === -1) {
    throw (0, _lib.makeError)(_sdkConstants.ERROR_CODE.VALIDATION_ERROR, `Invalid locale language: ${lang}`);
  }

  return {
    country,
    lang
  };
}

function getAmount(amount) {
  if (typeof amount === 'string' || typeof amount === 'number') {
    amount = amount.toString();

    if (amount.match(/^\d+$/)) {
      amount = `${amount}.00`;
    }

    return amount;
  }
}

function getStyle(params) {
  const {
    label = 'paypal',
    period,
    tagline
  } = params.style || {};
  return {
    label,
    period,
    tagline
  };
}

function getButtonParams(params, req, res) {
  const {
    env,
    clientID,
    fundingSource,
    renderedButtons = [],
    currency,
    intent,
    commit,
    vault,
    enableFunding,
    disableFunding,
    disableCard,
    merchantID,
    buttonSessionID,
    pageSessionID,
    clientMetadataID,
    clientAccessToken,
    userIDToken,
    debug = false,
    onShippingChange = false,
    platform = _sdkConstants.PLATFORM.DESKTOP
  } = params;
  const locale = getLocale(params);
  const cspNonce = (0, _lib.getCSPNonce)(res);
  const amount = getAmount(params.amount);
  const style = getStyle(params);
  const buyerCountry = getBuyerCountry(req, params);
  const basicFundingEligibility = getFundingEligibilityParam(req);
  const paymentMethodToken = getPaymentMethodToken(req);
  const branded = getBranded(params);
  const riskData = getRiskDataParam(req);
  const correlationID = req.correlationId || '';
  const cookies = getCookieString(req);
  return {
    env,
    clientID,
    fundingSource,
    renderedButtons,
    buyerCountry,
    currency,
    intent,
    commit,
    vault,
    enableFunding,
    disableFunding,
    disableCard,
    merchantID,
    userIDToken,
    buttonSessionID,
    clientAccessToken,
    basicFundingEligibility,
    cspNonce,
    debug: Boolean(debug),
    style,
    onShippingChange,
    locale,
    amount,
    riskData,
    pageSessionID,
    clientMetadataID,
    correlationID,
    platform,
    cookies,
    paymentMethodToken,
    branded
  };
}

function getButtonPreflightParams(params) {
  let {
    [_sdkConstants.SDK_QUERY_KEYS.CLIENT_ID]: clientID,
    [_sdkConstants.SDK_QUERY_KEYS.MERCHANT_ID]: merchantID,
    [_sdkConstants.SDK_QUERY_KEYS.CURRENCY]: currency = _sdkConstants.CURRENCY.USD,
    [_constants.SPB_QUERY_KEYS.USER_ID_TOKEN]: userIDToken,
    [_constants.SPB_QUERY_KEYS.AMOUNT]: amount = '0.00'
  } = params;

  if (merchantID) {
    merchantID = merchantID.split(',');
  } else {
    merchantID = [];
  }

  amount = getAmount(amount);

  if (!clientID) {
    throw new _lib.makeError(_sdkConstants.ERROR_CODE.VALIDATION_ERROR, `Please provide a ${_sdkConstants.SDK_QUERY_KEYS.CLIENT_ID} query parameter`);
  }

  if (!userIDToken) {
    throw new _lib.makeError(_sdkConstants.ERROR_CODE.VALIDATION_ERROR, `Please provide a ${_constants.SPB_QUERY_KEYS.USER_ID_TOKEN} query parameter`);
  }

  for (const merchant of merchantID) {
    if (!merchant.match(/^[A-Z0-9]+$/)) {
      throw new _lib.makeError(_sdkConstants.ERROR_CODE.VALIDATION_ERROR, `Invalid ${_sdkConstants.SDK_QUERY_KEYS.MERCHANT_ID} query parameter`);
    }
  }

  if (currency && !(0, _belter.constHas)(_sdkConstants.CURRENCY, currency)) {
    throw new _lib.makeError(_sdkConstants.ERROR_CODE.VALIDATION_ERROR, `Invalid ${_sdkConstants.SDK_QUERY_KEYS.CURRENCY} query parameter`);
  }

  if (amount && !amount.match(/^\d+\.\d{2}$/)) {
    throw new _lib.makeError(_sdkConstants.ERROR_CODE.VALIDATION_ERROR, `Invalid ${_constants.SPB_QUERY_KEYS.AMOUNT} query parameter`);
  }

  if (!amount) {
    throw new Error(`Amount should be defined`);
  }

  return {
    clientID,
    merchantID,
    currency,
    userIDToken,
    amount
  };
}