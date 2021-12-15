"use strict";

var _belter = require("belter");

var _script = require("./script");

// $FlowFixMe
jest.setTimeout(30000);
const cache = {
  // eslint-disable-next-line no-unused-vars
  get: key => Promise.resolve(),
  set: (key, value) => Promise.resolve(value)
};
const logBuffer = {
  debug: _belter.noop,
  info: _belter.noop,
  flush: _belter.noop,
  warn: _belter.noop,
  error: _belter.noop
};
test('compileLocalSmartQRCodeClientScript', async () => {
  const script = await (0, _script.compileLocalSmartQRCodeClientScript)();

  if (!script) {
    throw new Error(`Expected a script from compileLocalSmartQRCodeClientScript`);
  }
});
test('getSmartQRCodeClientScript - base', async () => {
  const script = await (0, _script.getSmartQRCodeClientScript)();

  if (!script) {
    throw new Error(`Expected a script from compileLocalSmartQRCodeClientScript`);
  }
});
test('getSmartQRCodeClientScript - debug', async () => {
  const debug = true;
  const locationInformation = {
    cdnHostName: '',
    paypalDomain: ''
  };
  const script = await (0, _script.getSmartQRCodeClientScript)({
    logBuffer,
    cache,
    debug,
    locationInformation
  });

  if (!script) {
    throw new Error(`Expected a script from compileLocalSmartQRCodeClientScript`);
  }
});