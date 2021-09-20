"use strict";

exports.__esModule = true;
exports.resolveMerchantID = resolveMerchantID;

async function resolveMerchantID(req, {
  merchantID,
  getMerchantID,
  facilitatorAccessToken
}) {
  if (merchantID) {
    return merchantID;
  }

  return [await getMerchantID(req, facilitatorAccessToken)];
}