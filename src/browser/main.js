var devMode = (process.argv || []).indexOf('--dev') !== -1;
if (devMode) {
  // enables ES6+ support
  require('babel/register')();
} else {
  // enables ES6+ support withouth depending on babel runtime
  require('babel/polyfill');
}

// starts the electron app
require('./app');
