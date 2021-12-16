"use strict";

exports.__esModule = true;
exports.getSDKMeta = getSDKMeta;
exports.sdkMiddleware = sdkMiddleware;

var _sdkClient = require("@paypal/sdk-client");

var _belter = require("belter");

var _sdkConstants = require("@paypal/sdk-constants");

var _watchers = require("../watchers");

var _config = require("../config");

var _util = require("./util");

function getSDKMetaString(req) {
  const sdkMeta = req.query.sdkMeta || '';

  if (typeof sdkMeta !== 'string') {
    throw new TypeError(`Expected sdkMeta to be a string`);
  }

  return sdkMeta;
}

function getSDKMeta(req) {
  return (0, _sdkClient.unpackSDKMeta)(getSDKMetaString(req));
}

let logBuffer;

function sdkMiddleware({
  logger = _util.defaultLogger,
  cache,
  locationInformation
}, {
  app,
  script,
  preflight
}) {
  logBuffer = logBuffer || (0, _util.getLogBuffer)(logger);
  (0, _watchers.startWatchers)({
    logBuffer,
    cache,
    locationInformation
  });

  const appMiddleware = async (req, res) => {
    logBuffer.flush(req);

    try {
      let params;

      try {
        params = { ...(0, _belter.undotify)(req.query),
          ...(0, _belter.undotify)(req.body)
        };
      } catch (err) {
        return (0, _util.clientErrorResponse)(res, `Invalid params: ${(0, _util.safeJSON)(req.query)}`);
      }

      const sdkMeta = getSDKMetaString(req);
      let meta;

      try {
        meta = getSDKMeta(req);
      } catch (err) {
        logger.warn(req, 'bad_sdk_meta', {
          sdkMeta: (req.query.sdkMeta || '').toString(),
          err: err.stack ? err.stack : err.toString()
        });
        return (0, _util.clientErrorResponse)(res, `Invalid sdk meta: ${(req.query.sdkMeta || '').toString()}`);
      }

      await app({
        req,
        res,
        params,
        meta,
        logBuffer,
        sdkMeta
      });
      logBuffer.flush(req);
    } catch (err) {
      if ((0, _util.isError)(err, _sdkConstants.ERROR_CODE.VALIDATION_ERROR)) {
        logger.warn(req, _config.EVENT.VALIDATION, {
          err: err.stack ? err.stack : err.toString()
        });
        return (0, _util.clientErrorResponse)(res, err.message);
      }

      console.error(err.stack ? err.stack : err); // eslint-disable-line no-console

      logger.error(req, _config.EVENT.ERROR, {
        err: err.stack ? err.stack : err.toString()
      });
      return (0, _util.serverErrorResponse)(res, err.stack ? err.stack : err.toString());
    }
  };

  const scriptMiddleware = async (req, res) => {
    logBuffer.flush(req);

    try {
      if (!script) {
        throw new Error(`No script available`);
      }

      let params;

      try {
        params = (0, _belter.undotify)(req.query);
      } catch (err) {
        return (0, _util.clientErrorResponse)(res, `Invalid params: ${(0, _util.safeJSON)(req.query)}`);
      }

      await script({
        req,
        res,
        params,
        logBuffer
      });
      logBuffer.flush(req);
    } catch (err) {
      console.error(err.stack ? err.stack : err); // eslint-disable-line no-console

      logger.error(req, _config.EVENT.ERROR, {
        err: err.stack ? err.stack : err.toString()
      });
      return (0, _util.serverErrorResponse)(res, err.stack ? err.stack : err.toString());
    }
  };

  const preflightMiddleware = async (req, res) => {
    logBuffer.flush(req);
    res.header('Access-Control-Allow-Origin', '*');
    let params;

    try {
      params = (0, _belter.undotify)(req.query);
    } catch (err) {
      return (0, _util.clientErrorResponse)(res, `Invalid params: ${(0, _util.safeJSON)(req.query)}`);
    }

    if (!preflight) {
      return (0, _util.emptyResponse)(res);
    }

    try {
      return await preflight({
        req,
        res,
        params,
        logBuffer
      });
    } catch (err) {
      if ((0, _util.isError)(err, _sdkConstants.ERROR_CODE.VALIDATION_ERROR)) {
        logger.warn(req, _config.EVENT.VALIDATION, {
          err: err.stack ? err.stack : err.toString()
        });
        return (0, _util.clientErrorResponse)(res, err.message);
      }

      console.error(err.stack ? err.stack : err); // eslint-disable-line no-console

      logger.error(req, _config.EVENT.ERROR, {
        err: err.stack ? err.stack : err.toString()
      });
      return (0, _util.serverErrorResponse)(res, err.stack ? err.stack : err.toString());
    } finally {
      logBuffer.flush(req);
    }
  };

  const middleware = async (req, res) => {
    const url = req.url.split('?')[0];

    if (url === '/') {
      return await appMiddleware(req, res);
    }

    if (url === '/script') {
      res.header(_config.HTTP_HEADER.CACHE_CONTROL, `public, max-age=${_config.BROWSER_CACHE_TIME}`);
      res.header(_config.HTTP_HEADER.EXPIRES, new Date(Date.now() + _config.BROWSER_CACHE_TIME * 1000).toUTCString());
      return await scriptMiddleware(req, res);
    }

    if (url === '/preload') {
      return await preflightMiddleware(req, res);
    }

    res.status(404).send(`404 not found`);
  };

  return middleware;
}