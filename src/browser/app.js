import app from 'app';
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
app.on('window-all-closed', () => app.quit());


// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', () => buildNewWindow(app));
