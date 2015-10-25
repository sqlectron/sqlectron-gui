import Menu from 'menu';


export function attachMenuToWindow(app, mainWindow) {
  const template = buildTemplate(app, mainWindow);
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}


function buildTemplate(app, mainWindow) {
  return [
    {
      label: 'Sqlectron',
      submenu: [
        {
          label: 'About Sqlectron',
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
          label: 'Hide Sqlectron',
          accelerator: 'CmdOrCtrl+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'CmdOrCtrl+Shift+H',
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
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'Query',
      submenu: [
        {
          label: 'Execute',
          accelerator: 'CmdOrCtrl+E',
          click: () => mainWindow.webContents.send('sqlectron:query-execute'),
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          selector: 'undo:',
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          selector: 'redo:',
        },
        {
          type: 'separator',
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          selector: 'cut:',
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          selector: 'copy:',
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          selector: 'paste:',
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          selector: 'selectAll:',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow.reloadIgnoringCache(),
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+CmdOrCtrl+I',
          click: () => mainWindow.toggleDevTools(),
        },
      ],
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          selector: 'performMiniaturize:',
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
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
      submenu: [],
    },
  ];
}
