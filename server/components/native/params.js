"use strict";

exports.__esModule = true;
exports.getNativePopupParams = getNativePopupParams;
exports.getNativeFallbackParams = getNativeFallbackParams;

var _sdkConstants = require("@paypal/sdk-constants");

var _lib = require("../../lib");

var _config = require("../../config");

var _constants = require("./constants");

/* eslint max-depth: off */
function getParentDomain(params) {
  const {
    parentDomain
  } = params;

  if (!parentDomain) {
    throw new _lib.makeError(_sdkConstants.ERROR_CODE.VALIDATION_ERROR, `Parent domain not passed`);
  }

  if (typeof parentDomain !== 'string') {
    throw new _lib.makeError(_sdkConstants.ERROR_CODE.VALIDATION_ERROR, `Expected parentDomain param to be a string`);
  } // eslint-disable-next-line security/detect-unsafe-regex


  if (process.env.NODE_ENV !== 'development' && !parentDomain.match(/\.paypal\.com(:\d{1,4})?$/)) {
    throw new _lib.makeError(_sdkConstants.ERROR_CODE.VALIDATION_ERROR, `Expected paypal parentDomain`);
  }

  return parentDomain;
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

function getBuyerCountry(req, params) {
  return params.buyerCountry || req.get(_config.HTTP_HEADER.PP_GEO_LOC) || _sdkConstants.COUNTRY.US;
}

function getNativePopupParams(params, req, res) {
  const {
    debug = false,
    clientID,
    buttonSessionID,
    sessionID,
    sdkCorrelationID,
    env
  } = params;
  const cspNonce = (0, _lib.getCSPNonce)(res);
  const parentDomain = getParentDomain(params);
  const locale = getLocale(params);
  const buyerCountry = getBuyerCountry(req, params);
  return {
    cspNonce,
    parentDomain,
    debug: Boolean(debug),
    locale,
    buttonSessionID,
    sessionID,
    clientID,
    sdkCorrelationID,
    env,
    buyerCountry
  };
}

function getNativeFallbackParams(params, req, res) {
  const {
    debug = false
  } = params;
  const cspNonce = (0, _lib.getCSPNonce)(res);
  return {
    cspNonce,
    debug: Boolean(debug)
  };
}