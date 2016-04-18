import { readFileSync } from 'fs';
import { resolve } from 'path';


const devMode = (process.argv || []).indexOf('--dev') !== -1;
let appConfig;


export function get() {
  if (!appConfig) {
    const configPath = resolve(__dirname, '..', '..', devMode ? 'app' : '', 'package.json');
    appConfig = JSON.parse(readFileSync(configPath, 'utf8'));
  }
  return appConfig;
}
