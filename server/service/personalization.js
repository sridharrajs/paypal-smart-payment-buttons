"use strict";

exports.__esModule = true;
exports.resolvePersonalization = resolvePersonalization;

var _sdkConstants = require("@paypal/sdk-constants");

var _jsxPragmatic = require("jsx-pragmatic");

var _sdkLogos = require("@paypal/sdk-logos");

var _config = require("../config");

var _lib = require("../lib");

/** @jsx node */
const PERSONALIZATION_QUERY = `
    query GetPersonalization(
        $clientID: String,
        $buyerCountry: CountryCodes,
        $ip: String,
        $cookies: String,
        $currency: SupportedCountryCurrencies,
        $intent: FundingEligibilityIntent,
        $commit: Boolean,
        $vault: Boolean,
        $merchantID: [String],
        $buttonSessionID: String,
        $userAgent: String,
        $locale: LocaleInput!,
        $label: ButtonLabels,
        $period: String,
        $taglineEnabled: Boolean,
        $renderedButtons: [FundingButtonType]
        $layout: ButtonLayouts
        $buttonSize: ButtonSizes
    ) {
        checkoutCustomization(
            clientId: $clientID,
            merchantId: $merchantID,
            currency: $currency,
            commit: $commit,
            intent: $intent,
            vault: $vault,
            buyerCountry: $buyerCountry,
            ip: $ip,
            cookies: $cookies,
            buttonSessionId: $buttonSessionID,
            userAgent: $userAgent,
            locale: $locale,
            buttonLabel: $label,
            installmentPeriod: $period,
            taglineEnabled: $taglineEnabled,
            renderedButtons: $renderedButtons
            layout: $layout
            buttonSize: $buttonSize
        ) {
            tagline {
                text
                tracking {
                    impression
                    click
                }
            }
            buttonText {
                text
                tracking {
                    impression
                    click
                }
            }
            buttonAnimation {
                id
                text
                tracking {
                    impression
                    click
                }
            }
        }
    }
`;

function getDefaultPersonalization() {
  // $FlowFixMe
  return {};
}

const CLASS = {
  TEXT: 'paypal-button-text'
};

function contentToJSX(content) {
  content = content.replace(/\{logo:/g, '{');
  return ({
    logoColor,
    period
  } = {}) => {
    try {
      return (0, _lib.placeholderToJSX)(content, {
        text: token => (0, _jsxPragmatic.node)("span", {
          class: CLASS.TEXT
        }, token),
        pp: () => (0, _jsxPragmatic.node)(_sdkLogos.PPLogo, {
          logoColor: logoColor
        }),
        paypal: () => (0, _jsxPragmatic.node)(_sdkLogos.PayPalLogo, {
          logoColor: logoColor
        }),
        br: () => (0, _jsxPragmatic.node)("br", null),
        period: () => {
          return period ? period.toString() : null;
        }
      });
    } catch (err) {
      return null;
    }
  };
}

async function resolvePersonalization(req, gqlBatch, personalizationOptions) {
  let {
    logger,
    clientID,
    locale,
    buyerCountry,
    buttonSessionID,
    currency,
    intent,
    commit,
    vault,
    label,
    period,
    tagline,
    personalizationEnabled,
    renderedButtons,
    layout,
    buttonSize
  } = personalizationOptions;

  if (!personalizationEnabled) {
    return getDefaultPersonalization();
  }

  const ip = req.ip;
  const cookies = req.get('cookie') || '';
  const userAgent = req.get('user-agent') || '';
  intent = intent ? intent.toUpperCase() : intent;
  label = label ? label.toUpperCase() : label;
  const taglineEnabled = tagline === true || tagline === 'true';
  const personalizationVariables = {
    clientID,
    locale,
    buyerCountry,
    currency,
    intent,
    commit,
    vault,
    ip,
    cookies,
    userAgent,
    buttonSessionID,
    label,
    period,
    taglineEnabled,
    renderedButtons,
    layout,
    buttonSize
  }; // Fix enum checking errors for strings on graphql by only sending truthy variables

  for (const key of Object.keys(personalizationVariables)) {
    if (personalizationVariables[key] === '') {
      delete personalizationVariables[key];
    }
  }

  try {
    const result = await gqlBatch({
      query: PERSONALIZATION_QUERY,
      variables: personalizationVariables,
      timeout: _config.PERSONALIZATION_TIMEOUT
    });
    const personalization = result.checkoutCustomization;

    if (personalization && personalization.tagline && personalization.tagline.text) {
      personalization.tagline.Component = contentToJSX(personalization.tagline.text);
    }

    if (personalization && personalization.buttonText && personalization.buttonText.text) {
      personalization.buttonText.Component = contentToJSX(personalization.buttonText.text);
    }

    return personalization;
  } catch (err) {
    if (err.message && err.message.includes(_config.TIMEOUT_ERROR_MESSAGE)) {
      logger.track(req, {
        [_sdkConstants.FPTI_KEY.STATE]: _config.FPTI_STATE.BUTTON,
        [_sdkConstants.FPTI_KEY.TRANSITION]: 'personalization_promise_timeout',
        [_sdkConstants.FPTI_KEY.CONTEXT_ID]: buttonSessionID,
        [_sdkConstants.FPTI_KEY.CONTEXT_TYPE]: 'button_session_id',
        [_sdkConstants.FPTI_KEY.FEED]: 'payments_sdk'
      }, {});
    }

    logger.error(req, 'personalization_error_fallback', {
      err: err.stack ? err.stack : err.toString()
    });
    return getDefaultPersonalization();
  }
}