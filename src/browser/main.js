/* eslint global-require:0, no-var: 0, no-extend-native: 0, vars-on-top: 0 */
var config = require('./config');

var configData = config.get();

if (configData.printVersion) {
  console.log(configData.name, configData.version); // eslint-disable-line no-console
  process.exit(0);
}

// enables ES6+ support
if (configData.devMode) {
  require('babel-register');
}

require('babel-polyfill');

// starts the electron app
require('./app');
