import fs from 'fs';
import { homedir } from 'os';
import path from 'path';
import mkdirp from 'mkdirp';
import envPaths from 'env-paths';

import { readFile, resolveHomePathToAbsolute } from 'sqlectron-db-core/utils';

export {
  createCancelablePromise,
  getPort,
  readFile,
  resolveHomePathToAbsolute,
  versionCompare,
} from 'sqlectron-db-core/utils';

let configPath = '';

export function getConfigPath() {
  if (configPath) {
    return configPath;
  }

  const configName = 'sqlectron.json';
  const oldConfigPath = path.join(homedir(), `.${configName}`);

  if (process.env.SQLECTRON_HOME) {
    configPath = path.join(process.env.SQLECTRON_HOME, configName);
  } else if (fileExistsSync(oldConfigPath)) {
    configPath = oldConfigPath;
  } else {
    const newConfigDir = envPaths('Sqlectron', { suffix: '' }).config;
    configPath = path.join(newConfigDir, configName);
  }

  return configPath;
}

export function fileExists(filename) {
  return new Promise((resolve) => {
    fs.stat(filename, (err, stats) => {
      if (err) return resolve(false);
      resolve(stats.isFile());
    });
  });
}

export function fileExistsSync(filename) {
  try {
    return fs.statSync(filename).isFile();
  } catch (e) {
    return false;
  }
}

export function writeFile(filename, data): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export function writeJSONFile(filename, data) {
  return writeFile(filename, JSON.stringify(data, null, 2));
}

export function writeJSONFileSync(filename, data) {
  return fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

export function readJSONFile(filename) {
  return readFile(filename).then((data) => JSON.parse(data));
}

export function readJSONFileSync(filename) {
  const filePath = resolveHomePathToAbsolute(filename);
  const data = fs.readFileSync(path.resolve(filePath), { encoding: 'utf-8' });
  return JSON.parse(data);
}

export function createParentDirectory(filename) {
  return mkdirp(path.dirname(filename));
}

export function createParentDirectorySync(filename) {
  mkdirp.sync(path.dirname(filename));
}
