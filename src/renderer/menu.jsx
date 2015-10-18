import ipc from 'ipc';
import remote from 'remote';

export default class AppMenu {
  constructor ({ queryActions }) {
    this._queryActions = queryActions;
  }

  build ({ store }) {
    const Menu = remote.require('menu');
    const template = [
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
            click: function() { ipc.sendSync('quit-app'); },
          },
        ],
      },
      {
        label: 'Query',
        submenu: [
          {
            label: 'Execute',
            accelerator: 'CmdOrCtrl+E',
            click: () => this._queryActions.query(store.queryResult.sql),
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
            click: function() { remote.getCurrentWindow().reloadIgnoringCache(); },
          },
          {
            label: 'Toggle DevTools',
            accelerator: 'Alt+CmdOrCtrl+I',
            click: function() { remote.getCurrentWindow().toggleDevTools(); },
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

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  }
}
