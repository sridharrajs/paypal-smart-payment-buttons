"use strict";

exports.__esModule = true;
exports.compileNativePopupClientScript = compileNativePopupClientScript;
exports.getNativePopupClientScript = getNativePopupClientScript;
exports.getNativePopupRenderScript = getNativePopupRenderScript;
exports.compileNativeFallbackClientScript = compileNativeFallbackClientScript;
exports.getNativeFallbackClientScript = getNativeFallbackClientScript;
exports.getNativeFallbackRenderScript = getNativeFallbackRenderScript;

var _path = require("path");

var _fs = require("fs");

var _belter = require("belter");

var _sdkConstants = require("@paypal/sdk-constants");

var _config = require("../../config");

var _lib = require("../../lib");

var _watchers = require("../../watchers");

const ROOT = (0, _path.join)(__dirname, '../../..');

async function compileNativePopupClientScript() {
  const webpackScriptPath = (0, _lib.resolveScript)((0, _path.join)(ROOT, _config.WEBPACK_CONFIG));

  if (webpackScriptPath && (0, _lib.isLocalOrTest)()) {
    const {
      WEBPACK_CONFIG_NATIVE_POPUP_DEBUG
    } = (0, _lib.babelRequire)(webpackScriptPath);
    const script = await (0, _lib.compileWebpack)(WEBPACK_CONFIG_NATIVE_POPUP_DEBUG, ROOT);
    return {
      script,
      version: _sdkConstants.ENV.LOCAL
    };
  }

  const distScriptPath = (0, _lib.resolveScript)((0, _path.join)(_config.SMART_BUTTONS_MODULE, _config.NATIVE_POPUP_CLIENT_JS));

  if (distScriptPath) {
    const script = (0, _fs.readFileSync)(distScriptPath).toString();
    return {
      script,
      version: _sdkConstants.ENV.LOCAL
    };
  }
}

async function getNativePopupClientScript({
  logBuffer,
  cache,
  debug = false,
  useLocal = (0, _lib.isLocalOrTest)(),
  locationInformation
} = {}) {
  if (useLocal) {
    const script = await compileNativePopupClientScript();

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
  const script = await read(debug ? _config.NATIVE_POPUP_CLIENT_JS : _config.NATIVE_POPUP_CLIENT_MIN_JS, _config.ACTIVE_TAG); // non-blocking download of the DEPLOY_TAG

  getDeployTag().catch(_belter.noop);
  return {
    script,
    version
  };
}

async function getLocalNativePopupRenderScript() {
  const webpackScriptPath = (0, _lib.resolveScript)((0, _path.join)(ROOT, _config.WEBPACK_CONFIG));

  if (webpackScriptPath && (0, _lib.isLocalOrTest)()) {
    const dir = (0, _path.dirname)(webpackScriptPath);
    const {
      WEBPACK_CONFIG_NATIVE_POPUP
    } = (0, _lib.babelRequire)(webpackScriptPath);
    const popup = (0, _lib.evalRequireScript)(await (0, _lib.compileWebpack)(WEBPACK_CONFIG_NATIVE_POPUP, dir));
    return {
      popup,
      version: _sdkConstants.ENV.LOCAL
    };
  }

  const distScriptPath = (0, _lib.resolveScript)((0, _path.join)(_config.SMART_BUTTONS_MODULE, _config.NATIVE_POPUP_CLIENT_JS));

  if (distScriptPath) {
    const popup = (0, _lib.dynamicRequire)(distScriptPath);
    return {
      popup,
      version: _sdkConstants.ENV.LOCAL
    };
  }
}

async function getNativePopupRenderScript({
  logBuffer,
  cache,
  debug,
  useLocal = (0, _lib.isLocalOrTest)(),
  locationInformation
} = {}) {
  if (useLocal) {
    const script = await getLocalNativePopupRenderScript();

    if (script) {
      return script;
    }
  }

  const {
    getTag,
    getDeployTag,
    import: watcherImport
  } = (0, _watchers.getPayPalSmartPaymentButtonsWatcher)({
    logBuffer,
    cache,
    locationInformation
  });
  const {
    version
  } = await getTag();
  const popup = await watcherImport(debug ? _config.NATIVE_POPUP_CLIENT_JS : _config.NATIVE_POPUP_CLIENT_MIN_JS, _config.ACTIVE_TAG); // non-blocking download of the DEPLOY_TAG

  getDeployTag().catch(_belter.noop);
  return {
    popup,
    version
  };
}

async function compileNativeFallbackClientScript() {
  const webpackScriptPath = (0, _lib.resolveScript)((0, _path.join)(ROOT, _config.WEBPACK_CONFIG));

  if (webpackScriptPath && (0, _lib.isLocalOrTest)()) {
    const {
      WEBPACK_CONFIG_NATIVE_FALLBACK_DEBUG
    } = (0, _lib.babelRequire)(webpackScriptPath);
    const script = await (0, _lib.compileWebpack)(WEBPACK_CONFIG_NATIVE_FALLBACK_DEBUG, ROOT);
    return {
      script,
      version: _sdkConstants.ENV.LOCAL
    };
  }

  const distScriptPath = (0, _lib.resolveScript)((0, _path.join)(_config.SMART_BUTTONS_MODULE, _config.NATIVE_FALLBACK_CLIENT_JS));

  if (distScriptPath) {
    const script = (0, _fs.readFileSync)(distScriptPath).toString();
    return {
      script,
      version: _sdkConstants.ENV.LOCAL
    };
  }
}

async function getNativeFallbackClientScript({
  logBuffer,
  cache,
  debug = false,
  useLocal = (0, _lib.isLocalOrTest)(),
  locationInformation
} = {}) {
  if (useLocal) {
    const script = await compileNativeFallbackClientScript();

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
  const script = await read(debug ? _config.NATIVE_FALLBACK_CLIENT_JS : _config.NATIVE_FALLBACK_CLIENT_MIN_JS, _config.ACTIVE_TAG); // non-blocking download of the DEPLOY_TAG

  getDeployTag().catch(_belter.noop);
  return {
    script,
    version
  };
}

async function getLocalNativeFallbackRenderScript() {
  const webpackScriptPath = (0, _lib.resolveScript)((0, _path.join)(ROOT, _config.WEBPACK_CONFIG));

  if (webpackScriptPath && (0, _lib.isLocalOrTest)()) {
    const dir = (0, _path.dirname)(webpackScriptPath);
    const {
      WEBPACK_CONFIG_NATIVE_FALLBACK
    } = (0, _lib.babelRequire)(webpackScriptPath);
    const fallback = (0, _lib.evalRequireScript)(await (0, _lib.compileWebpack)(WEBPACK_CONFIG_NATIVE_FALLBACK, dir));
    return {
      fallback,
      version: _sdkConstants.ENV.LOCAL
    };
  }

  const distScriptPath = (0, _lib.resolveScript)((0, _path.join)(_config.SMART_BUTTONS_MODULE, _config.NATIVE_FALLBACK_CLIENT_JS));

  if (distScriptPath) {
    const fallback = (0, _lib.dynamicRequire)(distScriptPath);
    return {
      fallback,
      version: _sdkConstants.ENV.LOCAL
    };
  }
}

async function getNativeFallbackRenderScript({
  logBuffer,
  cache,
  debug,
  useLocal = (0, _lib.isLocalOrTest)(),
  locationInformation
} = {}) {
  if (useLocal) {
    const script = await getLocalNativeFallbackRenderScript();

    if (script) {
      return script;
    }
  }

  const {
    getTag,
    getDeployTag,
    import: watcherImport
  } = (0, _watchers.getPayPalSmartPaymentButtonsWatcher)({
    logBuffer,
    cache,
    locationInformation
  });
  const {
    version
  } = await getTag();
  const fallback = await watcherImport(debug ? _config.NATIVE_FALLBACK_CLIENT_JS : _config.NATIVE_FALLBACK_CLIENT_MIN_JS, _config.ACTIVE_TAG); // non-blocking download of the DEPLOY_TAG

  getDeployTag().catch(_belter.noop);
  return {
    fallback,
    version
  };
}