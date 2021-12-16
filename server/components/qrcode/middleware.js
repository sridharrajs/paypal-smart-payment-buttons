"use strict";

exports.__esModule = true;
exports.getQRCodeMiddleware = getQRCodeMiddleware;

var _lib = require("../../lib");

var _constants = require("./constants");

var _params = require("./params");

var _script = require("./script");

var _nodeQrcode = require("./node-qrcode");

function getQRCodeMiddleware({
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
        cspNonce,
        qrPath,
        debug
      } = (0, _params.getParams)(params, req, res);

      if (!qrPath) {
        return (0, _lib.clientErrorResponse)(res, 'Please provide a qrPath query parameter');
      }

      const svgString = await _nodeQrcode.QRCode.toString(qrPath, {
        // width: 160,
        // width:  240,
        margin: 0,
        color: {
          dark: _constants.VENMO_BLUE,
          light: '#FFFFFF'
        }
      });
      const client = await (0, _script.getSmartQRCodeClientScript)({
        debug,
        logBuffer,
        cache,
        useLocal,
        locationInformation
      });
      logger.info(req, `qrcode_client_version_${client.version}`);
      logger.info(req, `qrcode_params`, {
        params: JSON.stringify(params)
      });
      const pageHTML = `
            <!DOCTYPE html>
            <head>
                <link 
                    nonce="${cspNonce}"
                    rel="stylesheet" 
                    href="https://www.paypalobjects.com/paypal-ui/web/fonts-and-normalize/1-1-0/fonts-and-normalize.min.css"
                />
            </head>
            <body data-nonce="${cspNonce}" data-client-version="${client.version}">
                ${meta.getSDKLoader({
        nonce: cspNonce
      })}
                <script nonce="${cspNonce}">${client.script}</script>
                <script nonce="${cspNonce}">
                    spbQRCode.renderQRCode(${(0, _lib.safeJSON)({
        svgString
      })});
                </script>
            </body>
        `;
      (0, _lib.allowFrame)(res);
      return (0, _lib.htmlResponse)(res, pageHTML);
    }
  });
}