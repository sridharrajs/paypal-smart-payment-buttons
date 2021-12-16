"use strict";

exports.__esModule = true;
exports.globals = void 0;

var _webpack = require("grumbler-scripts/config/webpack.config");

var _package = _interopRequireDefault(require("./package.json"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/* eslint import/no-commonjs: off, flowtype/require-valid-file-annotation: off, flowtype/require-return-type: off */


const globals = {
  __SMART_BUTTONS__: {
    __MAJOR_VERSION__: (0, _webpack.getNextVersion)(_package.default, 'major').replace(/_/g, '.'),
    __MINOR_VERSION__: (0, _webpack.getNextVersion)(_package.default, 'patch').replace(/_/g, '.')
  }
};
exports.globals = globals;