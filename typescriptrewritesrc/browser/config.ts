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
/**
 * Load app configurations.
 *
 * Since it may be loaded directly from the renderer process,
 * without passing through a transpiler, this file must use ES5.
 */

const fs = require('fs');
const path = require('path');
//const defaultsDeep = require('lodash.defaultsdeep');
const defaultsDeep = require('lodash').defaultsDeep;
const sqlectron = require('@armarti/unified-dataloader-core');

let config;

const cryptoSecret = 'j[F6Y6NoWT}+YG|4c|-<89:ByJ83-9Aj?O8>$Zk/[WFk_~gFbg7<wm+*V|A{xQZ,';

exports.get = function getConfiguration(cleanCache) {
  if (config && !cleanCache) {
    return config;
  }

  const args = (process.argv || []);
  const argsConfig = {
    devMode: args.indexOf('--dev') !== -1,
  };

  if (args.indexOf('--version') !== -1 || args.indexOf('-v') !== -1) {
    argsConfig.printVersion = true;
  }

  const basePath = path.resolve(__dirname, '..', '..');
  const packageConfig = readJSON(path.resolve(basePath, 'package.json'));

  sqlectron.config.prepareSync(cryptoSecret);
  const appConfig = sqlectron.config.getSync();
  const configPath = sqlectron.config.path();

  // use NODE_ENV for renderer process
  // but if that is not defined then use --dev arg
  const isDev = process.env.NODE_ENV !== 'production' || argsConfig.devMode;

  const defaultConfig = {
    path: configPath,
    log: {
      console: isDev,
      file: false,
      level: appConfig.level || (process.env.DEBUG ? 'debug' : 'error'),
      path: configPath.replace('.json', '.log'),
    },
  };

  const cryptoConfig = {
    crypto: {
      secret: cryptoSecret,
    },
  };

  config = defaultsDeep(
    cryptoConfig,
    appConfig,
    packageConfig,
    argsConfig,
    defaultConfig
  );

  return config;
};


function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
