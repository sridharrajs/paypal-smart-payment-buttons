"use strict";

exports.__esModule = true;
exports.ACTIVE_TAG = exports.LATEST_TAG = exports.PERSONALIZATION_TIMEOUT = exports.EXPERIMENT_TIMEOUT = exports.WALLET_TIMEOUT = exports.FUNDING_ELIGIBILITY_TIMEOUT = exports.SMART_BUTTONS_CDN_NAMESPACE = exports.SDK_CDN_NAMESPACE = exports.BROWSER_CACHE_TIME = exports.NATIVE_FALLBACK_CLIENT_MIN_JS = exports.NATIVE_FALLBACK_CLIENT_JS = exports.NATIVE_POPUP_CLIENT_MIN_JS = exports.NATIVE_POPUP_CLIENT_JS = exports.QRCODE_CLIENT_MIN_JS = exports.QRCODE_CLIENT_JS = exports.CARD_CLIENT_MIN_JS = exports.CARD_CLIENT_JS = exports.MENU_CLIENT_MIN_JS = exports.MENU_CLIENT_JS = exports.BUTTON_CLIENT_MIN_JS = exports.BUTTON_CLIENT_JS = exports.BUTTON_RENDER_JS = exports.SMART_BUTTONS_MODULE = exports.CHECKOUT_COMPONENTS_MODULE = exports.SDK_RELEASE_MODULE = exports.MODULE_DIR = exports.WEBPACK_CONFIG = exports.MODULE_POLL_INTERVAL = void 0;

var _path = require("path");

var _sdkConstants = require("@paypal/sdk-constants");

var _package = _interopRequireDefault(require("../../package.json"));

var _env = require("./env");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MODULE_POLL_INTERVAL = 5 * 60;
exports.MODULE_POLL_INTERVAL = MODULE_POLL_INTERVAL;
const WEBPACK_CONFIG = 'webpack.config';
exports.WEBPACK_CONFIG = WEBPACK_CONFIG;
const MODULE_DIR = (0, _path.join)(__dirname, '..');
exports.MODULE_DIR = MODULE_DIR;
const SDK_RELEASE_MODULE = '@paypal/sdk-release';
exports.SDK_RELEASE_MODULE = SDK_RELEASE_MODULE;
const CHECKOUT_COMPONENTS_MODULE = '@paypal/checkout-components';
exports.CHECKOUT_COMPONENTS_MODULE = CHECKOUT_COMPONENTS_MODULE;
const SMART_BUTTONS_MODULE = _package.default.name;
exports.SMART_BUTTONS_MODULE = SMART_BUTTONS_MODULE;
const BUTTON_RENDER_JS = 'dist/button.js';
exports.BUTTON_RENDER_JS = BUTTON_RENDER_JS;
const BUTTON_CLIENT_JS = 'dist/smart-payment-buttons.js';
exports.BUTTON_CLIENT_JS = BUTTON_CLIENT_JS;
const BUTTON_CLIENT_MIN_JS = 'dist/smart-payment-buttons.min.js';
exports.BUTTON_CLIENT_MIN_JS = BUTTON_CLIENT_MIN_JS;
const MENU_CLIENT_JS = 'dist/smart-menu.js';
exports.MENU_CLIENT_JS = MENU_CLIENT_JS;
const MENU_CLIENT_MIN_JS = 'dist/smart-menu.min.js';
exports.MENU_CLIENT_MIN_JS = MENU_CLIENT_MIN_JS;
const CARD_CLIENT_JS = 'dist/smart-card.js';
exports.CARD_CLIENT_JS = CARD_CLIENT_JS;
const CARD_CLIENT_MIN_JS = 'dist/smart-card.min.js';
exports.CARD_CLIENT_MIN_JS = CARD_CLIENT_MIN_JS;
const QRCODE_CLIENT_JS = 'dist/smart-qrcode.js';
exports.QRCODE_CLIENT_JS = QRCODE_CLIENT_JS;
const QRCODE_CLIENT_MIN_JS = 'dist/smart-qrcode.min.js';
exports.QRCODE_CLIENT_MIN_JS = QRCODE_CLIENT_MIN_JS;
const NATIVE_POPUP_CLIENT_JS = 'dist/smart-native-popup.js';
exports.NATIVE_POPUP_CLIENT_JS = NATIVE_POPUP_CLIENT_JS;
const NATIVE_POPUP_CLIENT_MIN_JS = 'dist/smart-native-popup.min.js';
exports.NATIVE_POPUP_CLIENT_MIN_JS = NATIVE_POPUP_CLIENT_MIN_JS;
const NATIVE_FALLBACK_CLIENT_JS = 'dist/smart-native-fallback.js';
exports.NATIVE_FALLBACK_CLIENT_JS = NATIVE_FALLBACK_CLIENT_JS;
const NATIVE_FALLBACK_CLIENT_MIN_JS = 'dist/smart-native-fallback.min.js';
exports.NATIVE_FALLBACK_CLIENT_MIN_JS = NATIVE_FALLBACK_CLIENT_MIN_JS;
const BROWSER_CACHE_TIME = 6 * 60 * 60;
exports.BROWSER_CACHE_TIME = BROWSER_CACHE_TIME;
const SDK_CDN_NAMESPACE = 'js-sdk-release';
exports.SDK_CDN_NAMESPACE = SDK_CDN_NAMESPACE;
const SMART_BUTTONS_CDN_NAMESPACE = 'smart-payment-buttons';
exports.SMART_BUTTONS_CDN_NAMESPACE = SMART_BUTTONS_CDN_NAMESPACE;
const FUNDING_ELIGIBILITY_TIMEOUT = 200;
exports.FUNDING_ELIGIBILITY_TIMEOUT = FUNDING_ELIGIBILITY_TIMEOUT;
const WALLET_TIMEOUT = {
  [_sdkConstants.ENV.PRODUCTION]: 2000,
  [_sdkConstants.ENV.LOCAL]: 10000,
  [_sdkConstants.ENV.STAGE]: 10000,
  [_sdkConstants.ENV.SANDBOX]: 10000,
  [_sdkConstants.ENV.TEST]: 10000
}[(0, _env.getEnv)()];
exports.WALLET_TIMEOUT = WALLET_TIMEOUT;
const EXPERIMENT_TIMEOUT = {
  [_sdkConstants.ENV.PRODUCTION]: 100,
  [_sdkConstants.ENV.LOCAL]: 10000,
  [_sdkConstants.ENV.STAGE]: 10000,
  [_sdkConstants.ENV.SANDBOX]: 10000,
  [_sdkConstants.ENV.TEST]: 10000
}[(0, _env.getEnv)()];
exports.EXPERIMENT_TIMEOUT = EXPERIMENT_TIMEOUT;
const PERSONALIZATION_TIMEOUT = 100;
exports.PERSONALIZATION_TIMEOUT = PERSONALIZATION_TIMEOUT;
const LATEST_TAG = 'latest';
exports.LATEST_TAG = LATEST_TAG;
const ACTIVE_TAG = `active-${(0, _env.getEnv)()}`;
exports.ACTIVE_TAG = ACTIVE_TAG;