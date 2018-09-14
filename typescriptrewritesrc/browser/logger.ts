/**
 * unified-dataloader-gui
 * Copyright (C) 2018 Armarti Industries
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import * as sqlectron from '@armarti/unified-dataloader-core';
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
