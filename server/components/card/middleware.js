"use strict";

exports.__esModule = true;
exports.getCardMiddleware = getCardMiddleware;

var _lib = require("../../lib");

var _constants = require("./constants");

var _params = require("./params");

var _script = require("./script");

function getCardMiddleware({
  logger = _lib.defaultLogger,
  cache,
  cdn = !(0, _lib.isLocalOrTest)(),
  getAccessToken,
  getInstanceLocationInformation
} = {}) {
  const useLocal = !cdn;
  const locationInformation = getInstanceLocationInformation();
  return (0, _lib.sdkMiddleware)({
    logger,
    cache,
    locationInformation
  }, {
    app: async ({
      req,
      res,
      params,
      meta,
      logBuffer
    }) => {
      logger.info(req, _constants.EVENT.RENDER);
      const {
        clientID,
        cspNonce,
        debug
      } = (0, _params.getParams)(params, req, res);
      const client = await (0, _script.getSmartCardClientScript)({
        debug,
        logBuffer,
        cache,
        useLocal,
        locationInformation
      });
      logger.info(req, `card_client_version_${client.version}`);
      logger.info(req, `card_params`, {
        params: JSON.stringify(params)
      });

      if (!clientID) {
        return (0, _lib.clientErrorResponse)(res, 'Please provide a clientID query parameter');
      }

      const facilitatorAccessTokenPromise = getAccessToken(req, clientID);
      const facilitatorAccessToken = await facilitatorAccessTokenPromise;
      const cardSetupOptions = {
        cspNonce,
        facilitatorAccessToken
      };
      const pageHTML = `
                <!DOCTYPE html>
                <head></head>
                <body data-nonce="${cspNonce}" data-client-version="${client.version}">
                    ${meta.getSDKLoader({
        nonce: cspNonce
      })}
                    <script nonce="${cspNonce}">${client.script}</script>
                    <script nonce="${cspNonce}">smartCard.setupCard(${(0, _lib.safeJSON)(cardSetupOptions)})</script>
                </body>
            `;
      (0, _lib.allowFrame)(res);
      return (0, _lib.htmlResponse)(res, pageHTML);
    }
  });
}