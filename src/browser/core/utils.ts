import fs from 'fs';
import { homedir } from 'os';
import path from 'path';
import mkdirp from 'mkdirp';
import envPaths from 'env-paths';

import { readFile, resolveHomePathToAbsolute } from 'sqlectron-db-core/utils';

export { resolveHomePathToAbsolute } from 'sqlectron-db-core/utils';

let configPath = '';

export function getConfigPath(): string {
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

export function fileExists(filename: string): Promise<boolean> {
  return new Promise((resolve) => {
    fs.stat(filename, (err, stats) => {
      if (err) return resolve(false);
      resolve(stats.isFile());
    });
  });
}

export function fileExistsSync(filename: string): boolean {
  try {
    return fs.statSync(filename).isFile();
  } catch (e) {
    return false;
  }
}

export function writeFile(filename: string, data: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export function writeJSONFile<T>(filename: string, data: T): Promise<void> {
  return writeFile(filename, JSON.stringify(data, null, 2));
}

export function writeJSONFileSync<T>(filename: string, data: T): void {
  return fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

export function readJSONFile<T>(filename: string): Promise<T> {
  return readFile(filename).then((data) => JSON.parse(data));
}

export function readJSONFileSync<T>(filename: string): T {
  const filePath = resolveHomePathToAbsolute(filename);
  const data = fs.readFileSync(path.resolve(filePath), { encoding: 'utf-8' });
  return JSON.parse(data);
}

export function createParentDirectory(filename: string): void {
  return mkdirp(path.dirname(filename));
}

export function createParentDirectorySync(filename: string): void {
  mkdirp.sync(path.dirname(filename));
}
