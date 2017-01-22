/* eslint global-require:0, no-var: 0, no-extend-native: 0, vars-on-top: 0 */
var config = require('./config');

// enables ES6+ support
if (config.get().devMode) {
  require('babel-register');
}

require('babel-polyfill');

// starts the electron app
require('./app');
