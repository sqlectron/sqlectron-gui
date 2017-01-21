import { app, dialog } from 'electron'; // eslint-disable-line import/no-unresolved
import createLogger from './logger';
import { buildNewWindow } from './window';

const logger = createLogger('app');

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


// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', () => buildNewWindow(app));


// Show only the error description to the user
process.on('uncaughtException', error => {
  logger.error('uncaughtException', error);
  return dialog.showErrorBox('An error occurred', error.name + ': ' + error.message);
});
