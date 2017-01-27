import * as sqlectron from 'sqlectron-core';
import config from './config';

// Hack solution to ignore console.error from dtrace imported by bunyan
/* eslint no-console:0 */
const realConsoleError = console.error;
console.error = () => {};
const { createLogger } = require('bunyan');
console.error = realConsoleError;


const dataConfig = config.get();

const loggerConfig = {
  app: 'sqlectron-gui',
  name: 'sqlectron-gui',
  level: dataConfig.log.level,
  streams: [],
};

if (dataConfig.log.console) {
  loggerConfig.streams.push({ stream: process.stdout });
}

if (dataConfig.log.file) {
  loggerConfig.streams.push({ path: dataConfig.log.path });
}

const logger = createLogger(loggerConfig);

// Set custom logger for sqlectron-core
sqlectron.setLogger((namespace) => logger.child({ namespace: `sqlectron-core:${namespace}` }));

export default (namespace) => logger.child({ namespace });
