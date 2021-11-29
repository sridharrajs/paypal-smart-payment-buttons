"use strict";

exports.__esModule = true;
exports.allowFrame = allowFrame;
exports.babelRegister = babelRegister;
exports.babelRequire = babelRequire;
exports.clientErrorResponse = clientErrorResponse;
exports.compileWebpack = compileWebpack;
exports.copy = copy;
exports.defaultLogger = void 0;
exports.dynamicRequire = dynamicRequire;
exports.emptyResponse = emptyResponse;
exports.evalRequireScript = evalRequireScript;
exports.getCSPNonce = getCSPNonce;
exports.getCookieString = getCookieString;
exports.getLogBuffer = getLogBuffer;
exports.getNonce = getNonce;
exports.htmlResponse = htmlResponse;
exports.isDefined = isDefined;
exports.isEmpty = isEmpty;
exports.isError = isError;
exports.isLocal = isLocal;
exports.isLocalOrTest = isLocalOrTest;
exports.isTest = isTest;
exports.javascriptResponse = javascriptResponse;
exports.makeError = makeError;
exports.placeholderToJSX = placeholderToJSX;
exports.promiseTimeout = promiseTimeout;
exports.resolveScript = resolveScript;
exports.safeJSON = safeJSON;
exports.serverErrorResponse = serverErrorResponse;

var _path = require("path");

var _webpackMemCompile = require("webpack-mem-compile");

var _webpack = _interopRequireDefault(require("webpack"));

var _belter = require("belter");

var _config = require("../config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function response(res, status, type, message) {
  res.status(status).header(_config.HTTP_HEADER.CONTENT_TYPE, type).header(_config.HTTP_HEADER.CONTENT_DISPOSITION, _config.HTTP_CONTENT_DISPOSITION.INLINE).send(message);
}

function serverErrorResponse(res, message) {
  response(res, _config.HTTP_STATUS_CODE.SERVER_ERROR, _config.HTTP_CONTENT_TYPE.TEXT, message);
}

function clientErrorResponse(res, message) {
  response(res, _config.HTTP_STATUS_CODE.CLIENT_ERROR, _config.HTTP_CONTENT_TYPE.TEXT, message);
}

function htmlResponse(res, html) {
  response(res, _config.HTTP_STATUS_CODE.SUCCESS, _config.HTTP_CONTENT_TYPE.HTML, html);
}

function javascriptResponse(res, javascript) {
  response(res, _config.HTTP_STATUS_CODE.SUCCESS, _config.HTTP_CONTENT_TYPE.JAVASCRIPT, javascript);
}

function emptyResponse(res) {
  response(res, _config.HTTP_STATUS_CODE.SUCCESS, _config.HTTP_CONTENT_TYPE.TEXT, '');
}

function allowFrame(res) {
  res.removeHeader(_config.HTTP_HEADER.X_FRAME_OPTIONS);
}

function isLocal() {
  return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
}

function isTest() {
  return process.env.NODE_ENV === 'test';
}

function isLocalOrTest() {
  return isLocal() || isTest();
} // eslint-disable-next-line no-unused-vars, flowtype/no-weak-types


function safeJSON(...args) {
  return JSON.stringify.apply(null, arguments).replace(/</g, '\\u003C').replace(/>/g, '\\u003E');
}

const defaultLogger = {
  debug: (req, ...args) => console.debug(...args),
  // eslint-disable-line no-console
  info: (req, ...args) => console.info(...args),
  // eslint-disable-line no-console
  warn: (req, ...args) => console.warn(...args),
  // eslint-disable-line no-console
  error: (req, ...args) => console.error(...args),
  // eslint-disable-line no-console
  track: (req, ...args) => console.error(...args) // eslint-disable-line no-console

};
exports.defaultLogger = defaultLogger;
const registerDirs = [];

function babelRegister(dir) {
  if (registerDirs.indexOf(dir) === -1) {
    registerDirs.push(dir);
  }

  require('@babel/register')({
    only: [path => {
      for (const registerDir of registerDirs) {
        if (path.indexOf(registerDir) === 0 && path.slice(registerDir.length).indexOf('/node_modules/') === -1) {
          return true;
        }
      }

      return false;
    }]
  });
}

function resolveScript(path) {
  try {
    return require.resolve(path);
  } catch (err) {// pass
  }
}

function dynamicRequire(path) {
  // $FlowFixMe
  return require(path); // eslint-disable-line security/detect-non-literal-require
}

function babelRequire(path) {
  babelRegister((0, _path.dirname)(path));
  return dynamicRequire(path);
}

async function compileWebpack(config, context) {
  config.context = context;
  return await (0, _webpackMemCompile.webpackCompile)({
    webpack: _webpack.default,
    config
  });
}

function evalRequireScript(script) {
  const module = {
    exports: {}
  }; // eslint-disable-next-line security/detect-eval-with-expression, no-eval

  eval(script); // $FlowFixMe

  return module.exports; // eslint-disable-line import/no-commonjs
}

function getNonce(res) {
  let nonce = res.locals && res.locals.nonce;

  if (!nonce || typeof nonce !== 'string') {
    nonce = '';
  }

  return nonce;
}

function getLogBuffer(logger) {
  const buffer = [];

  const push = (level, event, payload) => {
    buffer.push({
      level,
      event,
      payload
    });
  };

  const debug = (event, payload) => push('debug', event, payload);

  const info = (event, payload) => push('info', event, payload);

  const warn = (event, payload) => push('warn', event, payload);

  const error = (event, payload) => push('error', event, payload);

  const flush = req => {
    while (buffer.length) {
      const {
        level,
        event,
        payload
      } = buffer.shift();
      logger[level](req, event, payload);
    }
  };

  return {
    debug,
    info,
    warn,
    error,
    flush
  };
}

function placeholderToJSX(text, placeholders) {
  return (0, _belter.regexTokenize)(text, /(\{[a-z]+\})|([^{}]+)/g).map(token => {
    const match = token.match(/^{([a-z]+)}$/);

    if (match) {
      return placeholders[match[1]]();
    } else if (placeholders.text) {
      return placeholders.text(token);
    } else {
      return token;
    }
  }).filter(Boolean);
}

function isDefined(item) {
  return item !== null && typeof item !== 'undefined';
}

function isEmpty(obj) {
  const keys = Object.keys(obj);

  if (keys.length === 0) {
    return true;
  }

  for (const key of keys) {
    if (isDefined(obj[key])) {
      return false;
    }
  }

  return true;
}

function getCookieString(req) {
  if (!req.cookies) {
    return '';
  }

  return Object.keys(req.cookies).map(key => {
    const value = req.cookies[key];
    return `${key}=${value};`;
  }).join('');
}

function makeError(code, message, originalError) {
  if (originalError && originalError.stack) {
    message = `${message}\n\n${originalError.stack}`;
  }

  const err = new Error(message); // $FlowFixMe

  err.code = code;
  return err;
}

function isError(error, ...codes) {
  // $FlowFixMe
  const errorCode = error && error.code;
  return Boolean(errorCode && codes.some(code => errorCode === code));
}

function copy(obj) {
  const stringified = JSON.stringify(obj);

  if (typeof stringified === 'undefined') {
    // $FlowFixMe
    return;
  }

  return JSON.parse(stringified);
}

async function promiseTimeout(promise, time) {
  return await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${_config.TIMEOUT_ERROR_MESSAGE} ${time}ms`));
    }, time);

    const res = val => {
      clearTimeout(timer);
      resolve(val);
    };

    const rej = err => {
      clearTimeout(timer);
      reject(err);
    };

    promise.then(res, rej);
  });
}

function getCSPNonce(res) {
  let nonce = res.locals && res.locals.nonce;

  if (!nonce || typeof nonce !== 'string') {
    nonce = '';
  }

  return nonce;
}