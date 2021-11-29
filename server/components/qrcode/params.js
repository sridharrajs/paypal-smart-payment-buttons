"use strict";

exports.__esModule = true;
exports.getParams = getParams;

var _sdkConstants = require("@paypal/sdk-constants");

var _lib = require("../../lib");

function getParams(params, req, res) {
  const {
    env,
    qrPath,
    demo,
    locale = {},
    debug = false
  } = params;
  const {
    country = _sdkConstants.DEFAULT_COUNTRY,
    lang = _sdkConstants.COUNTRY_LANGS[country][0]
  } = locale;
  const cspNonce = (0, _lib.getCSPNonce)(res);
  return {
    env,
    cspNonce,
    qrPath,
    demo: Boolean(demo),
    debug: Boolean(debug),
    locale: {
      country,
      lang
    }
  };
}