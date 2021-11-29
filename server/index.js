"use strict";

exports.__esModule = true;

var _components = require("./components");

Object.keys(_components).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _components[key]) return;
  exports[key] = _components[key];
});

var _watchers = require("./watchers");

Object.keys(_watchers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _watchers[key]) return;
  exports[key] = _watchers[key];
});