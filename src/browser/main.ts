/* eslint global-require:0, no-var: 0, no-extend-native: 0, vars-on-top: 0 */
import * as sqlectron from 'sqlectron-core';
import { getConfig } from './config';

var configData = getConfig();

if (configData.printVersion) {
  console.log(configData.name, configData.version); // eslint-disable-line no-console
  process.exit(0);
}

if (
  configData.limitQueryDefaultSelectTop !== undefined &&
  configData.limitQueryDefaultSelectTop !== null
) {
  sqlectron.setSelectLimit();
}

// enables ES6+ support
if (configData.devMode) {
  require('@babel/register');
}

require('@babel/polyfill');

// starts the electron app
require('./app');
