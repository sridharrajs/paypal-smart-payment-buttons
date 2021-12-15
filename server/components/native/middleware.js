"use strict";

exports.__esModule = true;
exports.getNativePopupMiddleware = getNativePopupMiddleware;
exports.getNativeFallbackMiddleware = getNativeFallbackMiddleware;

var _sdkConstants = require("@paypal/sdk-constants");

var _jsxPragmatic = require("jsx-pragmatic");

var _lib = require("../../lib");

var _params = require("./params");

var _script = require("./script");

function getNativePopupMiddleware({
  logger = _lib.defaultLogger,
  cdn = !(0, _lib.isLocalOrTest)(),
  cache,
  tracking,
  fundingSource,
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
      logger.info(req, 'smart_native_popup_render');
      tracking(req);

      for (const name of Object.keys(req.cookies || {})) {
        logger.info(req, `smart_native_popup_cookie_${name || 'unknown'}`);
      }

      const {
        cspNonce,
        debug,
        parentDomain,
        env,
        sessionID,
        buttonSessionID,
        sdkCorrelationID,
        clientID,
        locale,
        buyerCountry
      } = (0, _params.getNativePopupParams)(params, req, res);
      const {
        NativePopup
      } = (await (0, _script.getNativePopupRenderScript)({
        logBuffer,
        cache,
        debug,
        useLocal,
        locationInformation
      })).popup;
      const client = await (0, _script.getNativePopupClientScript)({
        debug,
        logBuffer,
        cache,
        useLocal,
        locationInformation
      });
      const setupParams = {
        parentDomain,
        env,
        sessionID,
        buttonSessionID,
        sdkCorrelationID,
        clientID,
        fundingSource,
        locale,
        buyerCountry
      };
      const pageHTML = `
                <!DOCTYPE html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="manifest" href="/.well-known/manifest.webmanifest">
                    <title>Native Popup</title>
                </head>
                <body data-nonce="${cspNonce}" data-client-version="${client.version}">
                    ${NativePopup({
        fundingSource,
        cspNonce
      }).render((0, _jsxPragmatic.html)())}
                    ${meta.getSDKLoader({
        nonce: cspNonce
      })}
                    <script nonce="${cspNonce}">${client.script}</script>
                    <script nonce="${cspNonce}">spbNativePopup.setupNativePopup(${(0, _lib.safeJSON)(setupParams)})</script>
                </body>
            `;
      return (0, _lib.htmlResponse)(res, pageHTML);
    }
  });
}

function getNativeFallbackMiddleware({
  logger = _lib.defaultLogger,
  cdn = !(0, _lib.isLocalOrTest)(),
  cache,
  tracking,
  fundingSource,
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
      logger.info(req, 'smart_native_fallback_render');
      tracking(req);

      for (const name of Object.keys(req.cookies || {})) {
        logger.info(req, `smart_native_fallback_cookie_${name || 'unknown'}`);
      }

      const {
        cspNonce,
        debug
      } = (0, _params.getNativeFallbackParams)(params, req, res);
      const {
        NativeFallback
      } = (await (0, _script.getNativeFallbackRenderScript)({
        logBuffer,
        cache,
        debug,
        useLocal,
        locationInformation
      })).fallback;
      const client = await (0, _script.getNativeFallbackClientScript)({
        debug,
        logBuffer,
        cache,
        useLocal,
        locationInformation
      });
      const setupParams = {};
      const pageHTML = `
                <!DOCTYPE html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>Native Fallback</title>
                </head>
                <body data-nonce="${cspNonce}" data-client-version="${client.version}">
                    ${NativeFallback({
        fundingSource,
        cspNonce
      }).render((0, _jsxPragmatic.html)())}
                    ${meta.getSDKLoader({
        nonce: cspNonce
      })}
                    <script nonce="${cspNonce}">${client.script}</script>
                    <script nonce="${cspNonce}">spbNativeFallback.setupNativeFallback(${(0, _lib.safeJSON)(setupParams)})</script>
                </body>
            `;
      return (0, _lib.htmlResponse)(res, pageHTML);
    }
  });
}