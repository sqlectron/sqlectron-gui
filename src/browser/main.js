/* eslint no-var: 0, no-extend-native: 0, vars-on-top: 0 */
var devMode = (process.argv || []).indexOf('--dev') !== -1;

if (devMode) {
  // enables ES6+ support
  require('babel/register');
} else {
  // enables ES6+ support withouth depending on babel runtime
  require('babel/polyfill');
}

// starts the electron app
require('./app');


if (devMode) {
  /**
   * Terrible workaround for:
   * https://github.com/atom/electron/issues/3089
   */
  var configEnumerable = {
    configurable: true,
    enumerable: true,
  };
  Object.defineProperty(Error.prototype, 'message', configEnumerable);
  Object.defineProperty(Error.prototype, 'stack', configEnumerable);
}
