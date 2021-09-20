"use strict";

exports.__esModule = true;
exports.getButtonMiddleware = getButtonMiddleware;

var _jsxPragmatic = require("jsx-pragmatic");

var _sdkConstants = require("@paypal/sdk-constants");

var _belter = require("belter");

var _lib = require("../../lib");

var _service = require("../../service");

var _config = require("../../config");

var _script = require("./script");

var _params = require("./params");

var _style = require("./style");

var _instrumentation = require("./instrumentation");

function getButtonMiddleware({
  logger = _lib.defaultLogger,
  content: smartContent,
  graphQL,
  getAccessToken,
  cdn = !(0, _lib.isLocalOrTest)(),
  getMerchantID,
  cache,
  getInlineGuestExperiment = () => Promise.resolve(false),
  firebaseConfig,
  tracking,
  getPersonalizationEnabled = () => false,
  isFundingSourceBranded,
  getInstanceLocationInformation,
  getSDKLocationInformation
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
      logBuffer,
      sdkMeta
    }) => {
      logger.info(req, 'smart_buttons_render');

      for (const name of Object.keys(req.cookies || {})) {
        logger.info(req, `smart_buttons_cookie_${name || 'unknown'}`);
      }

      tracking(req);
      const {
        env,
        clientID,
        buttonSessionID,
        cspNonce,
        debug,
        buyerCountry,
        disableFunding,
        disableCard,
        userIDToken,
        amount,
        renderedButtons,
        merchantID: sdkMerchantID,
        currency,
        intent,
        commit,
        vault,
        clientAccessToken,
        basicFundingEligibility,
        locale,
        correlationID,
        cookies,
        enableFunding,
        style,
        paymentMethodToken,
        branded,
        fundingSource
      } = (0, _params.getButtonParams)(params, req, res);
      const {
        label,
        period,
        tagline
      } = style;
      logger.info(req, `button_params`, {
        params: JSON.stringify(params)
      });
      const sdkLocationInformation = await getSDKLocationInformation(req, params.env);

      if (!clientID) {
        return (0, _lib.clientErrorResponse)(res, 'Please provide a clientID query parameter');
      }

      const gqlBatch = (0, _lib.graphQLBatch)(req, graphQL, {
        env
      });
      const content = smartContent[locale.country][locale.lang] || {};
      const facilitatorAccessTokenPromise = getAccessToken(req, clientID);
      const merchantIDPromise = facilitatorAccessTokenPromise.then(facilitatorAccessToken => (0, _service.resolveMerchantID)(req, {
        merchantID: sdkMerchantID,
        getMerchantID,
        facilitatorAccessToken
      }));
      const clientPromise = (0, _script.getSmartPaymentButtonsClientScript)({
        debug,
        logBuffer,
        cache,
        useLocal,
        locationInformation
      });
      const renderPromise = (0, _script.getPayPalSmartPaymentButtonsRenderScript)({
        logBuffer,
        cache,
        useLocal,
        locationInformation,
        sdkLocationInformation
      });
      const isCardFieldsExperimentEnabledPromise = (0, _lib.promiseTimeout)(merchantIDPromise.then(merchantID => getInlineGuestExperiment(req, {
        merchantID: merchantID[0],
        locale,
        buttonSessionID,
        buyerCountry
      })), _config.EXPERIMENT_TIMEOUT).catch(err => {
        if (err.message && err.message.includes(_config.TIMEOUT_ERROR_MESSAGE)) {
          logger.track(req, {
            [_sdkConstants.FPTI_KEY.STATE]: _config.FPTI_STATE.BUTTON,
            [_sdkConstants.FPTI_KEY.TRANSITION]: 'is_card_fields_experiment_enabled_promise_timeout',
            [_sdkConstants.FPTI_KEY.CONTEXT_ID]: buttonSessionID,
            [_sdkConstants.FPTI_KEY.CONTEXT_TYPE]: 'button_session_id',
            [_sdkConstants.FPTI_KEY.FEED]: 'payments_sdk'
          }, {});
        }
      });
      const fundingEligibilityPromise = (0, _service.resolveFundingEligibility)(req, gqlBatch, {
        logger,
        clientID,
        merchantID: sdkMerchantID,
        buttonSessionID,
        currency,
        intent,
        commit,
        vault,
        disableFunding,
        disableCard,
        clientAccessToken,
        buyerCountry,
        basicFundingEligibility,
        enableFunding
      });
      const walletPromise = (0, _service.resolveWallet)(req, gqlBatch, {
        logger,
        clientID,
        merchantID: sdkMerchantID,
        buttonSessionID,
        currency,
        intent,
        commit,
        vault,
        amount,
        disableFunding,
        disableCard,
        clientAccessToken,
        buyerCountry,
        userIDToken,
        paymentMethodToken,
        branded
      }).catch(_belter.noop);
      const personalizationEnabled = getPersonalizationEnabled(req);
      const personalizationPromise = (0, _service.resolvePersonalization)(req, gqlBatch, {
        logger,
        clientID,
        buyerCountry,
        locale,
        buttonSessionID,
        currency,
        intent,
        commit,
        vault,
        label,
        period,
        tagline,
        personalizationEnabled,
        renderedButtons
      });
      gqlBatch.flush();
      let facilitatorAccessToken;

      try {
        facilitatorAccessToken = await facilitatorAccessTokenPromise;
      } catch (err) {
        if (err && err.statusCode && err.statusCode >= 400 && err.statusCode < 500) {
          return (0, _lib.clientErrorResponse)(res, 'Invalid clientID');
        }

        throw err;
      }

      const render = await renderPromise;
      const client = await clientPromise;
      const fundingEligibility = await fundingEligibilityPromise;
      const merchantID = await merchantIDPromise;
      const isCardFieldsExperimentEnabled = await isCardFieldsExperimentEnabledPromise;
      const wallet = await walletPromise;
      const personalization = await personalizationPromise;
      const brandedDefault = await isFundingSourceBranded(req, {
        clientID,
        fundingSource,
        wallet
      });
      const eligibility = {
        cardFields: isCardFieldsExperimentEnabled
      };
      logger.info(req, `button_render_version_${render.version}`);
      logger.info(req, `button_client_version_${client.version}`);
      const buttonProps = { ...params,
        nonce: cspNonce,
        csp: {
          nonce: cspNonce
        },
        fundingEligibility,
        content,
        wallet,
        personalization
      };

      try {
        if (render.button.validateButtonProps) {
          render.button.validateButtonProps(buttonProps);
        }
      } catch (err) {
        return (0, _lib.clientErrorResponse)(res, err.stack || err.message);
      }

      const buttonHTML = render.button.Buttons(buttonProps).render((0, _jsxPragmatic.html)());
      const setupParams = {
        fundingEligibility,
        buyerCountry,
        cspNonce,
        merchantID,
        sdkMeta,
        wallet,
        correlationID,
        firebaseConfig,
        facilitatorAccessToken,
        eligibility,
        content,
        cookies,
        personalization,
        brandedDefault
      };
      const pageHTML = `
                <!DOCTYPE html>
                <head></head>
                <body data-nonce="${cspNonce}" data-client-version="${client.version}" data-render-version="${render.version}">
                    <style nonce="${cspNonce}">${_style.buttonStyle}</style>

                    <div id="buttons-container" class="buttons-container" role="main" aria-label="PayPal">${buttonHTML}</div>

                    ${meta.getSDKLoader({
        nonce: cspNonce
      })}
                    <script nonce="${cspNonce}">${client.script}</script>
                    <script nonce="${cspNonce}">spb.setupButton(${(0, _lib.safeJSON)(setupParams)})</script>
                </body>
            `;
      (0, _instrumentation.setRootTransaction)(req, {
        userIDToken,
        clientAccessToken
      });
      (0, _lib.allowFrame)(res);
      return (0, _lib.htmlResponse)(res, pageHTML);
    },
    script: async ({
      req,
      res,
      params,
      logBuffer
    }) => {
      logger.info(req, 'smart_buttons_script_render');
      const {
        debug
      } = (0, _params.getButtonParams)(params, req, res);
      const {
        script
      } = await (0, _script.getSmartPaymentButtonsClientScript)({
        debug,
        logBuffer,
        cache,
        useLocal,
        locationInformation
      });
      return (0, _lib.javascriptResponse)(res, script);
    },
    preflight: ({
      req,
      res,
      params,
      logBuffer
    }) => {
      const {
        clientID,
        merchantID,
        currency,
        userIDToken,
        amount
      } = (0, _params.getButtonPreflightParams)(params);
      const gqlBatch = (0, _lib.graphQLBatch)(req, graphQL);
      (0, _service.resolveWallet)(req, gqlBatch, {
        logger,
        clientID,
        merchantID,
        currency,
        amount,
        userIDToken
      }).catch(err => {
        logBuffer.warn('preflight_error', {
          err: (0, _belter.stringifyError)(err)
        });
      });
      gqlBatch.flush();
      return (0, _lib.emptyResponse)(res);
    }
  });
}