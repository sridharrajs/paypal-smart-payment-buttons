"use strict";

exports.__esModule = true;

var _fundingEligibility = require("./fundingEligibility");

Object.keys(_fundingEligibility).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _fundingEligibility[key]) return;
  exports[key] = _fundingEligibility[key];
});

var _personalization = require("./personalization");

Object.keys(_personalization).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _personalization[key]) return;
  exports[key] = _personalization[key];
});

var _merchantID = require("./merchantID");

Object.keys(_merchantID).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _merchantID[key]) return;
  exports[key] = _merchantID[key];
});

var _wallet = require("./wallet");

Object.keys(_wallet).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _wallet[key]) return;
  exports[key] = _wallet[key];
});