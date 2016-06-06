var path = require('path');

/* eslint no-var: 0, no-extend-native: 0, vars-on-top: 0 */
var devMode = (process.argv || []).indexOf('--dev') !== -1;

// enables ES6+ support
if (devMode) {
  require('babel-register');

  // load the app dependencies
  var PATH_APP_NODE_MODULES = path.join(__dirname, '..', '..', 'app', 'node_modules');
  require('module').globalPaths.push(PATH_APP_NODE_MODULES);
}

require('babel-polyfill');

// starts the electron app
require('./app');
