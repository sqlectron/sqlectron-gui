import axios from 'axios';
import { BrowserWindow } from 'electron';
import { Config } from '../common/types/config';
import createLogger from './logger';

const logger = createLogger('gh-update-checker');

export async function check(mainWindow: BrowserWindow, appConfig: Config): Promise<void> {
  const currentVersion = `v${appConfig.version}`;
  logger.debug('current version %s', currentVersion);

  const repo = appConfig.repository?.url.replace('https://github.com/', '');
  const latestReleaseURL = `https://api.github.com/repos/${repo}/releases/latest`;
  const response = await axios.get(latestReleaseURL);

  logger.debug('latest version %s', response.data.tag_name);

  if (currentVersion === response.data.tag_name) {
    logger.debug('already using the latest version');
    return;
  }

  mainWindow.webContents.send('sqlectron:update-available', {
    currentVersion,
    latestVersion: response.data.tag_name,
  });
}
