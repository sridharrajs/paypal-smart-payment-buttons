"use strict";

exports.__esModule = true;
exports.setRootTransaction = setRootTransaction;

var _constants = require("./constants");

function setRootTransaction(req, {
  userIDToken,
  clientAccessToken
}) {
  const model = req.model = req.model || {};
  const rootTxn = model.rootTxn = model.rootTxn || {};

  if (userIDToken) {
    rootTxn.name = _constants.ROOT_TRANSACTION_NAME.SMART_BUTTONS_WALLET;
  } else if (clientAccessToken) {
    rootTxn.name = _constants.ROOT_TRANSACTION_NAME.SMART_BUTTONS_VAULT;
  } else {
    rootTxn.name = _constants.ROOT_TRANSACTION_NAME.SMART_BUTTONS;
  }
}