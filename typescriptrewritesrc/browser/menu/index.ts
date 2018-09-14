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
import { Menu } from 'electron'; // eslint-disable-line import/no-unresolved
import * as darwin from './darwin';
import * as linux from './linux';
import * as win32 from './win32';


const menus = {
  darwin,
  linux,
  win32,
};


export function attachMenuToWindow(app, buildNewWindow, appConfig) {
  const template = menus[process.platform].buildTemplate(app, buildNewWindow, appConfig);
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  if (process.platform === 'darwin') {
    const dockTemplate = menus.darwin.buildTemplateDockMenu(app, buildNewWindow);
    const dockMenu = Menu.buildFromTemplate(dockTemplate);
    app.dock.setMenu(dockMenu);
  }
}
