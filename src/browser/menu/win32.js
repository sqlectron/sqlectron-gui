import shell from 'shell';
import {
  productName,
  bugs as issuesURL,
  homepage as homepageURL,
} from '../../../package.json';


export function buildTemplate(app, buildNewWindow) {
  return [
    {
      'label': 'File',
      'submenu': [
        {
          label: 'New Window',
          accelerator: 'Cmd+N',
          click: () => buildNewWindow(app),
        },
        {
          'label': 'Quit',
          'accelerator': 'Alt+F4',
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
          click: (item, win) => win.webContents.send('sqlectron:query-execute'),
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
          accelerator: 'Ctrl+R',
          click: (item, win) => win.reloadIgnoringCache(),
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+Ctrl+I',
          click: (item, win) => win.toggleDevTools(),
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Report Issue',
          click: () => shell.openExternal(issuesURL),
        },
        {
          'label': `About ${productName}`,
          click: () => shell.openExternal(homepageURL),
        },
      ],
    },
  ];
}
