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
import { shell } from 'electron'; // eslint-disable-line import/no-unresolved

function sendMessage(win, message) {
  if (win) {
    win.webContents.send(message);
  }
}

export function buildTemplate(app, buildNewWindow, appConfig) {
  return [
    {
      label: appConfig.name,
      submenu: [
        {
          label: `About ${appConfig.name}`,
          selector: 'orderFrontStandardAboutPanel:',
        },
        {
          type: 'separator',
        },
        {
          label: 'Services',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          label: `Hide ${appConfig.name}`,
          accelerator: 'Cmd+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'Cmd+Shift+H',
          selector: 'hideOtherApplications:',
        },
        {
          label: 'Show All',
          selector: 'unhideAllApplications:',
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          accelerator: 'Cmd+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'New Window',
          accelerator: 'Cmd+N',
          click: () => buildNewWindow(app),
        },
        {
          label: 'New Tab',
          accelerator: 'Cmd+T',
          click: (item, win) => sendMessage(win, 'sqlectron:new-tab'),
        },
        {
          label: 'Close Tab',
          accelerator: 'Cmd+W',
          click: (item, win) => sendMessage(win, 'sqlectron:close-tab'),
        },
        {
          type: 'separator',
        },
        {
          label: 'Save Query',
          accelerator: 'Cmd+S',
          click: (item, win) => sendMessage(win, 'sqlectron:save-query'),
        },
        {
          label: 'Open Query',
          accelerator: 'Cmd+O',
          click: (item, win) => sendMessage(win, 'sqlectron:open-query'),
        },
      ],
    },
    {
      label: 'Query',
      submenu: [
        {
          label: 'Execute',
          accelerator: 'Cmd+Enter',
          click: (item, win) => sendMessage(win, 'sqlectron:query-execute'),
        },
        {
          label: 'Execute',
          accelerator: 'Cmd+R',
          click: (item, win) => sendMessage(win, 'sqlectron:query-execute'),
        },
        {
          label: 'Focus Query Editor',
          accelerator: 'Shift+Cmd+0',
          click: (item, win) => sendMessage(win, 'sqlectron:query-focus'),
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'Cmd+Z',
          selector: 'undo:',
        },
        {
          label: 'Redo',
          accelerator: 'Shift+Cmd+Z',
          selector: 'redo:',
        },
        {
          type: 'separator',
        },
        {
          label: 'Cut',
          accelerator: 'Cmd+X',
          selector: 'cut:',
        },
        {
          label: 'Copy',
          accelerator: 'Cmd+C',
          selector: 'copy:',
        },
        {
          label: 'Paste',
          accelerator: 'Cmd+V',
          selector: 'paste:',
        },
        {
          label: 'Select All',
          accelerator: 'Cmd+A',
          selector: 'selectAll:',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Cmd+Shift+R',
          click: (item, win) => win.webContents.reloadIgnoringCache(),
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+Cmd+I',
          click: (item, win) => win.toggleDevTools(),
        },
      ],
    },
    {
      label: 'Find',
      submenu: [
        {
          label: 'Search databases',
          accelerator: 'Shift+Cmd+9',
          click: (item, win) => sendMessage(win, 'sqlectron:toggle-database-search'),
        },
        {
          label: 'Search database objects',
          accelerator: 'Cmd+9',
          click: (item, win) => sendMessage(win, 'sqlectron:toggle-database-objects-search'),
        },
      ],
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Cmd+M',
          selector: 'performMiniaturize:',
        },
        {
          label: 'Close',
          accelerator: 'Cmd+Shift+W',
          selector: 'performClose:',
        },
        {
          type: 'separator',
        },
        {
          label: 'Bring All to Front',
          selector: 'arrangeInFront:',
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Report Issue',
          click: () => shell.openExternal(appConfig.bugs),
        },
      ],
    },
  ];
}


export function buildTemplateDockMenu(app, buildNewWindow) {
  return [
    { label: 'New Window', click: () => buildNewWindow(app) },
  ];
}
