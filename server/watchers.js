"use strict";

exports.__esModule = true;
exports.getPayPalSDKWatcher = getPayPalSDKWatcher;
exports.getPayPalSmartPaymentButtonsWatcher = getPayPalSmartPaymentButtonsWatcher;
exports.startWatchers = startWatchers;
exports.cancelWatchers = cancelWatchers;

var _grabthar = require("grabthar");

var _config = require("./config");

let paypalSDKWatcher;
let paypalSmartButtonsWatcher;

function logInfo(logBuffer, name, moduleDetails) {
  const {
    modulePath,
    nodeModulesPath,
    version,
    previousVersion
  } = moduleDetails;
  logBuffer.info(`${name}_tag_fetched`, {
    modulePath,
    nodeModulesPath,
    version,
    previousVersion
  });
  logBuffer.info(`${name}_version_${version.replace(/[^0-9]+/g, '_')}`, {});
}

function getPayPalSDKWatcher({
  logBuffer,
  cache,
  locationInformation,
  sdkLocationInformation = {}
}) {
  if (!cache || !logBuffer) {
    throw new Error(`Cache and logBuffer required`);
  }

  const {
    sdkActiveTag = _config.ACTIVE_TAG
  } = sdkLocationInformation;
  paypalSDKWatcher = paypalSDKWatcher || (0, _grabthar.poll)({
    cdnRegistry: (sdkLocationInformation == null ? void 0 : sdkLocationInformation.sdkCDNRegistry) || `https://${locationInformation.cdnHostName}/${_config.SDK_CDN_NAMESPACE}`,
    name: _config.SDK_RELEASE_MODULE,
    tags: [_config.LATEST_TAG, sdkActiveTag],
    period: _config.MODULE_POLL_INTERVAL,
    childModules: [_config.CHECKOUT_COMPONENTS_MODULE],
    flat: true,
    dependencies: true,
    logger: logBuffer,
    cache
  });
  const {
    get
  } = paypalSDKWatcher;

  const getTag = () => {
    return get(sdkActiveTag).then(tag => {
      if (logBuffer) {
        logInfo(logBuffer, 'render', tag);
      }

      return tag;
    });
  };

  const getDeployTag = () => {
    return get(_config.LATEST_TAG).then(tag => {
      if (logBuffer) {
        logInfo(logBuffer, 'deploy_render', tag);
      }

      return tag;
    });
  };

  return { ...paypalSDKWatcher,
    getTag,
    getDeployTag
  };
}

function getPayPalSmartPaymentButtonsWatcher({
  logBuffer,
  cache,
  locationInformation
}) {
  if (!cache || !logBuffer) {
    throw new Error(`Cache and logBuffer required`);
  }

  paypalSmartButtonsWatcher = paypalSmartButtonsWatcher || (0, _grabthar.poll)({
    cdnRegistry: `https://${locationInformation.cdnHostName}/${_config.SMART_BUTTONS_CDN_NAMESPACE}`,
    name: _config.SMART_BUTTONS_MODULE,
    tags: [_config.LATEST_TAG, _config.ACTIVE_TAG],
    period: _config.MODULE_POLL_INTERVAL,
    flat: true,
    dependencies: false,
    logger: logBuffer,
    cache
  });
  const {
    get
  } = paypalSmartButtonsWatcher;

  const getTag = () => {
    return get(_config.ACTIVE_TAG).then(tag => {
      if (logBuffer) {
        logInfo(logBuffer, 'client', tag);
      }

      return tag;
    });
  };

  const getDeployTag = () => {
    return get(_config.LATEST_TAG).then(tag => {
      if (logBuffer) {
        logInfo(logBuffer, 'deploy_client', tag);
      }

      return tag;
    });
  };

  return { ...paypalSmartButtonsWatcher,
    getTag,
    getDeployTag
  };
}

function startWatchers({
  logBuffer,
  cache,
  locationInformation
} = {}) {
  getPayPalSDKWatcher({
    logBuffer,
    cache,
    locationInformation
  });
  getPayPalSmartPaymentButtonsWatcher({
    logBuffer,
    cache,
    locationInformation
  });
}

function cancelWatchers() {
  if (paypalSDKWatcher) {
    paypalSDKWatcher.cancel();
    paypalSDKWatcher = null;
  }

  if (paypalSmartButtonsWatcher) {
    paypalSmartButtonsWatcher.cancel();
    paypalSmartButtonsWatcher = null;
  }
}