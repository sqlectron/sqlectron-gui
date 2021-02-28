/* eslint global-require:0, no-var: 0, no-extend-native: 0, vars-on-top: 0 */
import * as sqlectron from './core';
import { getConfig } from './config';

const configData = getConfig(false);

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

// starts the electron app
import './app';
