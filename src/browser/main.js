/* eslint global-require:0, no-var: 0, no-extend-native: 0, vars-on-top: 0 */
var devMode = (process.argv || []).indexOf('--dev') !== -1;

// enables ES6+ support
if (devMode) {
  require('babel-register');
}

require('babel-polyfill');

// starts the electron app
require('./app');
