import shell from 'shell';
import {
  productName,
  bugs as issuesURL,
} from '../../../package.json';


export function buildTemplate(app, mainWindow) {
  return [
    {
      label: productName,
      submenu: [
        {
          label: `About ${productName}`,
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
          label: `Hide ${productName}`,
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
      label: 'Query',
      submenu: [
        {
          label: 'Execute',
          accelerator: 'Cmd+Enter',
          click: () => mainWindow.webContents.send('sqlectron:query-execute'),
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
          accelerator: 'Cmd+R',
          click: () => mainWindow.reloadIgnoringCache(),
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+Cmd+I',
          click: () => mainWindow.toggleDevTools(),
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
          accelerator: 'Cmd+W',
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
          click: () => shell.openExternal(issuesURL),
        },
      ],
    },
  ];
}
