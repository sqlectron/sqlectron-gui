import { Menu, App } from 'electron';
import { Config } from '../../common/types/config';
import * as darwin from './darwin';
import * as linux from './linux';
import * as win32 from './win32';

const menus = {
  darwin,
  linux,
  win32,
};

type BuildWindow = (app: App) => void; // eslint-disable-line no-unused-vars

export function attachMenuToWindow(app: App, buildNewWindow: BuildWindow, appConfig: Config): void {
  const template = menus[process.platform].buildTemplate(app, buildNewWindow, appConfig);
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  if (process.platform === 'darwin') {
    const dockTemplate = menus.darwin.buildTemplateDockMenu(app, buildNewWindow);
    const dockMenu = Menu.buildFromTemplate(dockTemplate);
    app.dock.setMenu(dockMenu);
  }
}
