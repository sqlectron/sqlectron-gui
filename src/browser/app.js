import { app, dialog, globalShortcut } from 'electron'; // eslint-disable-line import/no-unresolved
import { buildNewWindow } from './window';


// TODO: Create a server to receive the crash reports
// Report crashes to our server.
// require('crash-reporter').start({
//   productName: 'Sqlectron',
//   companyName: 'Sqlectron',
//   submitURL: 'https://your-domain.com/url-to-submit',
//   autoSubmit: true
// });


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

let queryExecuteCommandRegister;

app.on('browser-window-created', (item, win) => {
  queryExecuteCommandRegister = () => {
    globalShortcut.register('CommandOrControl+R', () => {
      win.webContents.send('sqlectron:query-execute');
    });
  };
});

app.on('browser-window-focus', (event) => {
  queryExecuteCommandRegister();
});

app.on('browser-window-blur', () => {
  globalShortcut.unregister('CommandOrControl+R');
});


// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', () => buildNewWindow(app));


// Show only the error description to the user
process.on('uncaughtException', error => {
  if (error.stack) {
    console.error('Sqlectron error:', error.stack);
  }
  return dialog.showErrorBox('An error occurred', error.name + ': ' + error.message);
});
