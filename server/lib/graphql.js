"use strict";

exports.__esModule = true;
exports.graphQLBatch = graphQLBatch;
exports.pruneQuery = pruneQuery;
exports.buildQuery = buildQuery;
exports.graphqlTypes = void 0;

var _typedGraphqlify = require("typed-graphqlify");

var _sdkConstants = require("@paypal/sdk-constants");

var _config = require("../config");

var _util = require("./util");

function graphQLBatch(req, graphQL, opts) {
  const {
    env
  } = opts || {}; // eslint-disable-next-line flowtype/no-mutable-array

  let batch = [];
  let accessToken;
  let clientMetadataID = req.get(_config.HTTP_HEADER.CLIENT_METADATA_ID);
  let timer;
  let maxTimeout = 0;

  const batchedGraphQL = async ({
    query,
    variables,
    accessToken: callerAccessToken,
    clientMetadataID: callerClientMetadataID,
    timeout
  }) => {
    return await new Promise((resolve, reject) => {
      if (timeout && timeout > maxTimeout) {
        maxTimeout = env === _sdkConstants.ENV.PRODUCTION ? timeout : timeout * 10;
      }

      if (callerAccessToken) {
        if (accessToken && callerAccessToken !== accessToken) {
          throw new Error(`Access token for graphql call already set`);
        }

        accessToken = callerAccessToken;
      }

      if (callerClientMetadataID) {
        if (clientMetadataID && callerClientMetadataID !== clientMetadataID) {
          throw new Error(`Client Metadata id for graphql call already set`);
        }

        clientMetadataID = callerClientMetadataID;
      }

      batch.push({
        query,
        variables,
        resolve,
        reject
      });
      timer = setTimeout(() => {
        batchedGraphQL.flush();
      }, 0);
    });
  };

  batchedGraphQL.flush = async () => {
    clearTimeout(timer);

    if (!batch.length) {
      return;
    }

    const currentBatch = batch;
    batch = [];
    const payload = currentBatch.map(({
      query,
      variables
    }) => {
      return {
        query,
        variables
      };
    });
    let response;
    let gqlError;
    let gqlPromise = graphQL(req, payload, {
      accessToken,
      clientMetadataID
    });

    if (maxTimeout > 0) {
      gqlPromise = (0, _util.promiseTimeout)(gqlPromise, maxTimeout);
    }

    try {
      response = await gqlPromise;
    } catch (err) {
      gqlError = err;
    }

    for (let i = 0; i < currentBatch.length; i++) {
      const {
        resolve,
        reject
      } = currentBatch[i];

      if (gqlError) {
        reject(gqlError);
        continue;
      }

      const batchItem = response && response[i];

      if (!batchItem) {
        reject(new Error(`No response from gql`));
        continue;
      }

      const {
        result,
        error
      } = batchItem;

      if (gqlError || error) {
        reject(gqlError || error);
      } else {
        resolve(result);
      }
    }
  };

  return batchedGraphQL;
}

const graphqlTypes = {
  boolean: _typedGraphqlify.types.boolean,
  string: _typedGraphqlify.types.string
};
exports.graphqlTypes = graphqlTypes;

function isGraphQLType(val) {
  for (const type of Object.values(graphqlTypes)) {
    if (val === type) {
      return true;
    }
  }

  return false;
}

function assertQuery(value) {
  if (typeof value === 'object' && value !== null) {
    // $FlowFixMe[class-object-subtyping]
    return value;
  }

  throw new Error(`Invalid query`);
}

function treeShakeQuery(query) {
  const result = {};

  for (const key of Object.keys(query)) {
    const value = query[key];

    if (!(0, _util.isDefined)(value)) {
      continue;
    }

    if (isGraphQLType(value)) {
      result[key] = value;
      continue;
    }

    if (typeof value === 'object' && value !== null) {
      const treeShakedQuery = treeShakeQuery(assertQuery(value));

      if (!(0, _util.isEmpty)(treeShakedQuery)) {
        result[key] = treeShakedQuery;
      }

      continue;
    }

    throw new Error(`Unrecognized type: ${typeof value}`);
  }

  return result;
}

function pruneQuery(query, existingData) {
  const result = {};

  for (const key of Object.keys(query)) {
    const value = query[key]; // $FlowFixMe

    const existingValue = existingData[key];

    if (!(0, _util.isDefined)(existingValue)) {
      result[key] = value;
      continue;
    }

    if (!(0, _util.isDefined)(value) || isGraphQLType(value)) {
      continue;
    }

    if (typeof value === 'object' && value !== null) {
      if (typeof existingValue !== 'object' || existingValue === null) {
        throw new Error(`Expected existing value to be object`);
      }

      result[key] = pruneQuery(assertQuery(value), existingValue);
      continue;
    }

    throw new Error(`Unrecognized type: ${typeof value}`);
  }

  return result;
}

function buildQuery({
  name,
  key,
  inputTypes,
  inputs,
  query
}) {
  const treeShakedQuery = treeShakeQuery(query);

  if ((0, _util.isEmpty)(treeShakedQuery)) {
    return;
  }

  return (0, _typedGraphqlify.query)(name, (0, _typedGraphqlify.params)(inputTypes, {
    [key]: (0, _typedGraphqlify.params)(inputs, treeShakedQuery)
  }));
}