"use strict";

exports.__esModule = true;
exports.getEnv = getEnv;
exports.isEnv = isEnv;

var _sdkConstants = require("@paypal/sdk-constants");

function getEnv() {
  let ppEnv;

  try {
    // $FlowFixMe
    ppEnv = require('environment-paypal');
  } catch (err) {// pass
  }

  if (ppEnv && ppEnv.isProd() || process.env.NODE_ENV === _sdkConstants.ENV.PRODUCTION) {
    return _sdkConstants.ENV.PRODUCTION;
  } else if (ppEnv && ppEnv.isSandbox() || process.env.NODE_ENV === _sdkConstants.ENV.SANDBOX) {
    return _sdkConstants.ENV.SANDBOX;
  } else if (ppEnv && ppEnv.isStage() || process.env.NODE_ENV === _sdkConstants.ENV.STAGE) {
    return _sdkConstants.ENV.STAGE;
  } else if (ppEnv && ppEnv.isTest() || process.env.NODE_ENV === _sdkConstants.ENV.TEST) {
    return _sdkConstants.ENV.TEST;
  } else if (ppEnv && ppEnv.isDev() || process.env.NODE_ENV === _sdkConstants.ENV.LOCAL) {
    return _sdkConstants.ENV.LOCAL;
  }

  return _sdkConstants.ENV.PRODUCTION;
}

function isEnv(...envs) {
  const currentEnv = getEnv();
  return Boolean(envs.find(env => env === currentEnv));
}