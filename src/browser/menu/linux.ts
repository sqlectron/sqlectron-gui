import { shell } from 'electron';
import { BrowserWindow, App, MenuItem, MenuItemConstructorOptions } from 'electron';
import { Config } from '../../common/types/config';

function sendMessage(win: BrowserWindow, message: string) {
  if (win) {
    win.webContents.send(message);
  }
}

type BuildWindow = (app: App) => void; // eslint-disable-line no-unused-vars

export function buildTemplate(
  app: App,
  buildNewWindow: BuildWindow,
  appConfig: Config,
): Array<MenuItemConstructorOptions | MenuItem> {
  return [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Window',
          accelerator: 'Ctrl+N',
          click: () => buildNewWindow(app),
        },
        {
          label: 'New Tab',
          accelerator: 'Ctrl+T',
          click: (item, win) => sendMessage(win as BrowserWindow, 'sqlectron:new-tab'),
        },
        {
          label: 'Close Tab',
          accelerator: 'Ctrl+W',
          click: (item, win) => sendMessage(win as BrowserWindow, 'sqlectron:close-tab'),
        },
        {
          type: 'separator',
        },
        {
          label: 'Save Query',
          accelerator: 'Ctrl+S',
          click: (item, win) => sendMessage(win as BrowserWindow, 'sqlectron:save-query'),
        },
        {
          label: 'Save Query As',
          accelerator: 'Shift+Ctrl+S',
          click: (item, win) => sendMessage(win as BrowserWindow, 'sqlectron:save-query-as'),
        },
        {
          label: 'Open Query',
          accelerator: 'Ctrl+O',
          click: (item, win) => sendMessage(win as BrowserWindow, 'sqlectron:open-query'),
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          accelerator: 'Ctrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'Query',
      submenu: [
        {
          label: 'Execute',
          accelerator: 'Ctrl+Enter',
          click: (item, win) => sendMessage(win as BrowserWindow, 'sqlectron:query-execute'),
        },
        {
          label: 'Execute',
          accelerator: 'Ctrl+R',
          click: (item, win) => sendMessage(win as BrowserWindow, 'sqlectron:query-execute'),
        },
        {
          label: 'Focus Query Editor',
          accelerator: 'Shift+Ctrl+0',
          click: (item, win) => sendMessage(win as BrowserWindow, 'sqlectron:query-focus'),
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'Ctrl+Z',
          role: 'undo',
        },
        {
          label: 'Redo',
          accelerator: 'Shift+Ctrl+Z',
          role: 'redo',
        },
        {
          type: 'separator',
        },
        {
          label: 'Cut',
          accelerator: 'Ctrl+X',
          role: 'cut',
        },
        {
          label: 'Copy',
          accelerator: 'Ctrl+C',
          role: 'copy',
        },
        {
          label: 'Paste',
          accelerator: 'Ctrl+V',
          role: 'paste',
        },
        {
          label: 'Select All',
          accelerator: 'Ctrl+A',
          role: 'selectAll',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Ctrl+Shift+R',
          click: (item, win) => (win as BrowserWindow).webContents.reloadIgnoringCache(),
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+Ctrl+I',
          click: (item, win) => (win as BrowserWindow).webContents.toggleDevTools(),
        },
        {
          type: 'separator',
        },
        {
          label: 'Zoom In',
          accelerator: 'Ctrl+=',
          click: (item, win) => sendMessage(win as BrowserWindow, 'sqlectron:zoom-in'),
        },
        {
          label: 'Zoom Out',
          accelerator: 'Ctrl+-',
          click: (item, win) => sendMessage(win as BrowserWindow, 'sqlectron:zoom-out'),
        },
        {
          label: 'Reset Zoom',
          accelerator: 'Ctrl+0',
          click: (item, win) => sendMessage(win as BrowserWindow, 'sqlectron:zoom-reset'),
        },
      ],
    },
    {
      label: 'Find',
      submenu: [
        {
          label: 'Search databases',
          accelerator: 'Shift+Ctrl+9',
          click: (item, win) =>
            sendMessage(win as BrowserWindow, 'sqlectron:toggle-database-search'),
        },
        {
          label: 'Search database objects',
          accelerator: 'Ctrl+9',
          click: (item, win) =>
            sendMessage(win as BrowserWindow, 'sqlectron:toggle-database-objects-search'),
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Report Issue',
          click: () => shell.openExternal(appConfig.bugs as string),
        },
        {
          label: `About ${appConfig.name}`,
          click: () => shell.openExternal(appConfig.homepage as string),
        },
      ],
    },
  ];
}
