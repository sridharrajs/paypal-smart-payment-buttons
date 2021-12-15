"use strict";

exports.__esModule = true;
exports.default = exports.WEBPACK_CONFIG_TEST = exports.WEBPACK_CONFIG_NATIVE_FALLBACK_DEBUG = exports.WEBPACK_CONFIG_NATIVE_FALLBACK_MIN = exports.WEBPACK_CONFIG_NATIVE_FALLBACK = exports.WEBPACK_CONFIG_NATIVE_POPUP_DEBUG = exports.WEBPACK_CONFIG_NATIVE_POPUP_MIN = exports.WEBPACK_CONFIG_NATIVE_POPUP = exports.WEBPACK_CONFIG_QRCODE_DEBUG = exports.WEBPACK_CONFIG_QRCODE_MIN = exports.WEBPACK_CONFIG_QRCODE = exports.WEBPACK_CONFIG_CARD_DEBUG = exports.WEBPACK_CONFIG_CARD_MIN = exports.WEBPACK_CONFIG_CARD = exports.WEBPACK_CONFIG_MENU_DEBUG = exports.WEBPACK_CONFIG_MENU_MIN = exports.WEBPACK_CONFIG_MENU = exports.WEBPACK_CONFIG_BUTTONS_LOCAL_DEBUG = exports.WEBPACK_CONFIG_BUTTONS_DEBUG = exports.WEBPACK_CONFIG_BUTTONS_MIN = exports.WEBPACK_CONFIG_BUTTONS = void 0;

var _webpack = require("grumbler-scripts/config/webpack.config");

var _globals = require("./globals");

var _globals2 = require("./test/globals");

/* eslint import/no-nodejs-modules: off, import/no-default-export: off */
function getSmartWebpackConfig({
  entry,
  env,
  filename,
  minify = true,
  debug = false,
  libraryTarget = 'window',
  modulename
}) {
  return (0, _webpack.getWebpackConfig)({
    env,
    entry: `${__dirname}/${entry}`,
    modulename,
    filename,
    minify,
    debug,
    libraryTarget,
    vars: _globals.globals,
    sourcemaps: false
  });
}

const WEBPACK_CONFIG_BUTTONS = getSmartWebpackConfig({
  modulename: 'spb',
  entry: 'src/button',
  filename: 'smart-payment-buttons',
  minify: false,
  debug: true,
  vars: _globals.globals
});
exports.WEBPACK_CONFIG_BUTTONS = WEBPACK_CONFIG_BUTTONS;
const WEBPACK_CONFIG_BUTTONS_MIN = getSmartWebpackConfig({
  modulename: 'spb',
  entry: 'src/button',
  filename: 'smart-payment-buttons',
  minify: true,
  vars: _globals.globals
});
exports.WEBPACK_CONFIG_BUTTONS_MIN = WEBPACK_CONFIG_BUTTONS_MIN;
const WEBPACK_CONFIG_BUTTONS_DEBUG = getSmartWebpackConfig({
  modulename: 'spb',
  entry: 'src/button',
  filename: 'smart-payment-buttons',
  debug: true,
  minify: false,
  vars: _globals.globals
});
exports.WEBPACK_CONFIG_BUTTONS_DEBUG = WEBPACK_CONFIG_BUTTONS_DEBUG;
const WEBPACK_CONFIG_BUTTONS_LOCAL_DEBUG = getSmartWebpackConfig({
  modulename: 'spb',
  env: 'local',
  entry: 'src/button',
  filename: 'smart-payment-buttons',
  debug: true,
  minify: false,
  vars: _globals.globals,
  libraryTarget: 'umd'
});
exports.WEBPACK_CONFIG_BUTTONS_LOCAL_DEBUG = WEBPACK_CONFIG_BUTTONS_LOCAL_DEBUG;
const WEBPACK_CONFIG_MENU = getSmartWebpackConfig({
  modulename: 'spb',
  entry: 'src/menu',
  filename: 'smart-menu',
  minify: false,
  vars: _globals.globals
});
exports.WEBPACK_CONFIG_MENU = WEBPACK_CONFIG_MENU;
const WEBPACK_CONFIG_MENU_MIN = getSmartWebpackConfig({
  modulename: 'spb',
  entry: 'src/menu',
  filename: 'smart-menu',
  minify: true,
  vars: _globals.globals
});
exports.WEBPACK_CONFIG_MENU_MIN = WEBPACK_CONFIG_MENU_MIN;
const WEBPACK_CONFIG_MENU_DEBUG = getSmartWebpackConfig({
  modulename: 'spb',
  entry: 'src/menu',
  filename: 'smart-menu',
  debug: true,
  minify: false,
  vars: _globals.globals
});
exports.WEBPACK_CONFIG_MENU_DEBUG = WEBPACK_CONFIG_MENU_DEBUG;
const WEBPACK_CONFIG_CARD = getSmartWebpackConfig({
  modulename: 'smartCard',
  entry: 'src/card',
  filename: 'smart-card',
  minify: false,
  vars: _globals.globals
});
exports.WEBPACK_CONFIG_CARD = WEBPACK_CONFIG_CARD;
const WEBPACK_CONFIG_CARD_MIN = getSmartWebpackConfig({
  modulename: 'smartCard',
  entry: 'src/card',
  filename: 'smart-card',
  minify: true,
  vars: _globals.globals
});
exports.WEBPACK_CONFIG_CARD_MIN = WEBPACK_CONFIG_CARD_MIN;
const WEBPACK_CONFIG_CARD_DEBUG = getSmartWebpackConfig({
  modulename: 'smartCard',
  entry: 'src/card',
  filename: 'smart-card',
  debug: true,
  minify: false,
  vars: _globals.globals
});
exports.WEBPACK_CONFIG_CARD_DEBUG = WEBPACK_CONFIG_CARD_DEBUG;
const WEBPACK_CONFIG_QRCODE = getSmartWebpackConfig({
  modulename: 'spbQRCode',
  entry: 'src/qrcode',
  filename: 'smart-qrcode',
  minify: false,
  vars: _globals.globals,
  libraryTarget: 'umd'
});
exports.WEBPACK_CONFIG_QRCODE = WEBPACK_CONFIG_QRCODE;
const WEBPACK_CONFIG_QRCODE_MIN = getSmartWebpackConfig({
  modulename: 'spbQRCode',
  entry: 'src/qrcode',
  filename: 'smart-qrcode',
  minify: true,
  vars: _globals.globals,
  libraryTarget: 'umd'
});
exports.WEBPACK_CONFIG_QRCODE_MIN = WEBPACK_CONFIG_QRCODE_MIN;
const WEBPACK_CONFIG_QRCODE_DEBUG = getSmartWebpackConfig({
  modulename: 'spbQRCode',
  entry: 'src/qrcode',
  filename: 'smart-qrcode',
  debug: true,
  minify: false,
  vars: _globals.globals,
  libraryTarget: 'umd'
});
exports.WEBPACK_CONFIG_QRCODE_DEBUG = WEBPACK_CONFIG_QRCODE_DEBUG;
const WEBPACK_CONFIG_NATIVE_POPUP = getSmartWebpackConfig({
  modulename: 'spbNativePopup',
  entry: 'src/native/popup',
  filename: 'smart-native-popup',
  minify: false,
  vars: _globals.globals,
  libraryTarget: 'umd'
});
exports.WEBPACK_CONFIG_NATIVE_POPUP = WEBPACK_CONFIG_NATIVE_POPUP;
const WEBPACK_CONFIG_NATIVE_POPUP_MIN = getSmartWebpackConfig({
  modulename: 'spbNativePopup',
  entry: 'src/native/popup',
  filename: 'smart-native-popup',
  minify: true,
  vars: _globals.globals,
  libraryTarget: 'umd'
});
exports.WEBPACK_CONFIG_NATIVE_POPUP_MIN = WEBPACK_CONFIG_NATIVE_POPUP_MIN;
const WEBPACK_CONFIG_NATIVE_POPUP_DEBUG = getSmartWebpackConfig({
  modulename: 'spbNativePopup',
  entry: 'src/native/popup',
  filename: 'smart-native-popup',
  debug: true,
  minify: false,
  vars: _globals.globals,
  libraryTarget: 'umd'
});
exports.WEBPACK_CONFIG_NATIVE_POPUP_DEBUG = WEBPACK_CONFIG_NATIVE_POPUP_DEBUG;
const WEBPACK_CONFIG_NATIVE_FALLBACK = getSmartWebpackConfig({
  modulename: 'spbNativeFallback',
  entry: 'src/native/fallback',
  filename: 'smart-native-fallback',
  minify: false,
  vars: _globals.globals,
  libraryTarget: 'umd'
});
exports.WEBPACK_CONFIG_NATIVE_FALLBACK = WEBPACK_CONFIG_NATIVE_FALLBACK;
const WEBPACK_CONFIG_NATIVE_FALLBACK_MIN = getSmartWebpackConfig({
  modulename: 'spbNativeFallback',
  entry: 'src/native/fallback',
  filename: 'smart-native-fallback',
  minify: true,
  vars: _globals.globals,
  libraryTarget: 'umd'
});
exports.WEBPACK_CONFIG_NATIVE_FALLBACK_MIN = WEBPACK_CONFIG_NATIVE_FALLBACK_MIN;
const WEBPACK_CONFIG_NATIVE_FALLBACK_DEBUG = getSmartWebpackConfig({
  modulename: 'spbNativeFallback',
  entry: 'src/native/fallback',
  filename: 'smart-native-fallback',
  debug: true,
  minify: false,
  vars: _globals.globals,
  libraryTarget: 'umd'
});
exports.WEBPACK_CONFIG_NATIVE_FALLBACK_DEBUG = WEBPACK_CONFIG_NATIVE_FALLBACK_DEBUG;
const WEBPACK_CONFIG_TEST = (0, _webpack.getWebpackConfig)({
  modulename: 'spb',
  test: true,
  options: {
    devtool: 'inline-source-map'
  },
  vars: { ..._globals.globals,
    ..._globals2.testGlobals,
    __TEST__: true
  }
});
exports.WEBPACK_CONFIG_TEST = WEBPACK_CONFIG_TEST;
var _default = [WEBPACK_CONFIG_BUTTONS, WEBPACK_CONFIG_BUTTONS_MIN, WEBPACK_CONFIG_MENU, WEBPACK_CONFIG_MENU_MIN, WEBPACK_CONFIG_QRCODE, WEBPACK_CONFIG_QRCODE_MIN, WEBPACK_CONFIG_NATIVE_POPUP, WEBPACK_CONFIG_NATIVE_POPUP_MIN, WEBPACK_CONFIG_NATIVE_FALLBACK, WEBPACK_CONFIG_NATIVE_FALLBACK_MIN, WEBPACK_CONFIG_CARD, WEBPACK_CONFIG_CARD_MIN];
exports.default = _default;