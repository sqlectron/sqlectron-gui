import { shell } from 'electron'; // eslint-disable-line import/no-unresolved

function sendMessage(win, message) {
  if (win) {
    win.webContents.send(message);
  }
}


export function buildTemplate(app, buildNewWindow, appConfig) {
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
          click: (item, win) => sendMessage(win, 'sqlectron:new-tab'),
        },
        {
          label: 'Close Tab',
          accelerator: 'Ctrl+W',
          click: (item, win) => sendMessage(win, 'sqlectron:close-tab'),
        },
        {
          type: 'separator',
        },
        {
          label: 'Save Query',
          accelerator: 'Ctrl+S',
          click: (item, win) => sendMessage(win, 'sqlectron:save-query'),
        },
        {
          label: 'Open Query',
          accelerator: 'Ctrl+O',
          click: (item, win) => sendMessage(win, 'sqlectron:open-query'),
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          accelerator: 'Alt+F4',
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
          click: (item, win) => sendMessage(win, 'sqlectron:query-execute'),
        },
        {
          label: 'Execute',
          accelerator: 'Ctrl+R',
          click: (item, win) => sendMessage(win, 'sqlectron:query-execute'),
        },
        {
          label: 'Focus Query Editor',
          accelerator: 'Shift+Ctrl+0',
          click: (item, win) => sendMessage(win, 'sqlectron:query-focus'),
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'Ctrl+Z',
          selector: 'undo:',
        },
        {
          label: 'Redo',
          accelerator: 'Shift+Ctrl+Z',
          selector: 'redo:',
        },
        {
          type: 'separator',
        },
        {
          label: 'Cut',
          accelerator: 'Ctrl+X',
          selector: 'cut:',
        },
        {
          label: 'Copy',
          accelerator: 'Ctrl+C',
          selector: 'copy:',
        },
        {
          label: 'Paste',
          accelerator: 'Ctrl+V',
          selector: 'paste:',
        },
        {
          label: 'Select All',
          accelerator: 'Ctrl+A',
          selector: 'selectAll:',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Ctrl+Shift+R',
          click: (item, win) => win.webContents.reloadIgnoringCache(),
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+Ctrl+I',
          click: (item, win) => win.toggleDevTools(),
        },
      ],
    },
    {
      label: 'Find',
      submenu: [
        {
          label: 'Search databases',
          accelerator: 'Shift+Ctrl+9',
          click: (item, win) => sendMessage(win, 'sqlectron:toggle-database-search'),
        },
        {
          label: 'Search database objects',
          accelerator: 'Ctrl+9',
          click: (item, win) => sendMessage(win, 'sqlectron:toggle-database-objects-search'),
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
        {
          label: `About ${appConfig.name}`,
          click: () => shell.openExternal(appConfig.homepage),
        },
      ],
    },
  ];
}
