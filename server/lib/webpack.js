"use strict";

exports.__esModule = true;
exports.getWebpackDevScript = getWebpackDevScript;

var _isObject = _interopRequireDefault(require("is-object"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-sync: off */
function normalizeAssets(assets) {
  if ((0, _isObject.default)(assets)) {
    // $FlowFixMe
    return Object.values(assets);
  }

  return Array.isArray(assets) ? assets : [assets];
}

function getWebpackDevScript(res) {
  const {
    webpackStats,
    fs
  } = res.locals;

  if (!webpackStats || !fs) {
    return;
  } // $FlowFixMe


  const webpackStatsJson = webpackStats.toJson();
  const assetsByChunkName = webpackStatsJson.assetsByChunkName;
  const outputPath = webpackStatsJson.outputPath;
  const script = normalizeAssets(assetsByChunkName.main).filter(path => path.endsWith('.js')) // $FlowFixMe
  .map(path => fs.readFileSync(`${outputPath}/${path}`)).join('\n');
  return script;
}