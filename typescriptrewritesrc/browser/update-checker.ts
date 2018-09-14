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
import axios from 'axios';
import createLogger from './logger';

const logger = createLogger('gh-update-checker');
const WAIT_2_SECS = 2000;


export async function check(mainWindow, appConfig) {
  const currentVersion = `v${appConfig.version}`;
  logger.debug('current version %s', currentVersion);

  const repo = appConfig.repository.url.replace('https://github.com/', '');
  const latestReleaseURL = `https://api.github.com/repos/${repo}/releases/latest`;
  const response = await axios.get(latestReleaseURL);

  logger.debug('latest version %s', response.data.tag_name);
  if (currentVersion === response.data.tag_name) {
    logger.debug('already using the latest version');
    return;
  }

  // give some time to the render process be ready
  setTimeout(
    () => mainWindow.webContents.send('sqlectron:update-available'),
    WAIT_2_SECS
  );
}
