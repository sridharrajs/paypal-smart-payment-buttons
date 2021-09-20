"use strict";

exports.__esModule = true;
exports.getMenuMiddleware = getMenuMiddleware;

var _lib = require("../../lib");

var _constants = require("./constants");

var _params = require("./params");

var _script = require("./script");

function getMenuMiddleware({
  logger = _lib.defaultLogger,
  cache,
  cdn = !(0, _lib.isLocalOrTest)(),
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
      const client = await (0, _script.getSmartMenuClientScript)({
        debug,
        logBuffer,
        cache,
        useLocal,
        locationInformation
      });
      logger.info(req, `menu_client_version_${client.version}`);
      logger.info(req, `menu_params`, {
        params: JSON.stringify(params)
      });

      if (!clientID) {
        return (0, _lib.clientErrorResponse)(res, 'Please provide a clientID query parameter');
      }

      const pageHTML = `
                <!DOCTYPE html>
                <head></head>
                <body data-nonce="${cspNonce}" data-client-version="${client.version}">
                    ${meta.getSDKLoader({
        nonce: cspNonce
      })}
                    <script nonce="${cspNonce}">${client.script}</script>
                    <script nonce="${cspNonce}">spb.setupMenu(${(0, _lib.safeJSON)({
        cspNonce
      })})</script>
                </body>
            `;
      (0, _lib.allowFrame)(res);
      return (0, _lib.htmlResponse)(res, pageHTML);
    }
  });
}