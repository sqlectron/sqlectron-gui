import app from 'app';
import { buildNewWindow } from './window';


// Report crashes to our server.
require('crash-reporter').start();


// Quit when all windows are closed.
app.on('window-all-closed', () => app.quit());


// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', () => buildNewWindow(app));
