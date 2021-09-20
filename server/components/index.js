"use strict";

exports.__esModule = true;

var _buttons = require("./buttons");

Object.keys(_buttons).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _buttons[key]) return;
  exports[key] = _buttons[key];
});

var _menu = require("./menu");

Object.keys(_menu).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _menu[key]) return;
  exports[key] = _menu[key];
});

var _card = require("./card");

Object.keys(_card).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _card[key]) return;
  exports[key] = _card[key];
});

var _native = require("./native");

Object.keys(_native).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _native[key]) return;
  exports[key] = _native[key];
});

var _qrcode = require("./qrcode");

Object.keys(_qrcode).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _qrcode[key]) return;
  exports[key] = _qrcode[key];
});