"use strict";

exports.__esModule = true;

var _middleware = require("./middleware");

Object.keys(_middleware).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _middleware[key]) return;
  exports[key] = _middleware[key];
});