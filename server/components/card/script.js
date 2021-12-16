"use strict";

exports.__esModule = true;
exports.compileLocalSmartCardClientScript = compileLocalSmartCardClientScript;
exports.getSmartCardClientScript = getSmartCardClientScript;

var _path = require("path");

var _belter = require("belter");

var _sdkConstants = require("@paypal/sdk-constants");

var _config = require("../../config");

var _lib = require("../../lib");

var _watchers = require("../../watchers");

const ROOT = (0, _path.join)(__dirname, '../../..');

async function compileLocalSmartCardClientScript() {
  const webpackScriptPath = (0, _lib.resolveScript)((0, _path.join)(ROOT, _config.WEBPACK_CONFIG));

  if (webpackScriptPath && (0, _lib.isLocalOrTest)()) {
    const {
      WEBPACK_CONFIG_CARD_DEBUG
    } = (0, _lib.babelRequire)(webpackScriptPath);
    const script = await (0, _lib.compileWebpack)(WEBPACK_CONFIG_CARD_DEBUG, ROOT);
    return {
      script,
      version: _sdkConstants.ENV.LOCAL
    };
  }

  const distScriptPath = (0, _lib.resolveScript)((0, _path.join)(_config.SMART_BUTTONS_MODULE, _config.CARD_CLIENT_JS));

  if (distScriptPath) {
    const script = (0, _lib.dynamicRequire)(distScriptPath);
    return {
      script,
      version: _sdkConstants.ENV.LOCAL
    };
  }
}

async function getSmartCardClientScript({
  logBuffer,
  cache,
  debug = false,
  useLocal = (0, _lib.isLocalOrTest)(),
  locationInformation
} = {}) {
  if (useLocal) {
    const script = await compileLocalSmartCardClientScript();

    if (script) {
      return script;
    }
  }

  const {
    getTag,
    getDeployTag,
    read
  } = (0, _watchers.getPayPalSmartPaymentButtonsWatcher)({
    logBuffer,
    cache,
    locationInformation
  });
  const {
    version
  } = await getTag();
  const script = await read(debug ? _config.CARD_CLIENT_JS : _config.CARD_CLIENT_MIN_JS, _config.ACTIVE_TAG); // non-blocking download of the DEPLOY_TAG

  getDeployTag().catch(_belter.noop);
  return {
    script,
    version
  };
}