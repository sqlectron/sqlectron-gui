import * as sqlectron from './core';
import { getConfig } from './config';

// Hack solution to ignore console.error from dtrace imported by bunyan
/* eslint no-console:0 */
const realConsoleError = console.error;
// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
console.error = (message?: any, ...optionalParams: any[]) => {};
import { createLogger } from 'bunyan';

console.error = realConsoleError;

const dataConfig = getConfig();

export interface LogStream {
  path?: string;
  stream?: NodeJS.WriteStream;
}

export interface LoggerConfig {
  app: string;
  name: string;
  level: string;
  streams: Array<LogStream>;
}

const loggerConfig: LoggerConfig = {
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

export default (namespace: string): Console => logger.child({ namespace });
