#!/usr/bin/env node
/* eslint no-var: 0, object-shorthand:0 */
import fs from 'fs';
import { join } from 'path';
import electron from 'electron';
// import devtoolsInstaller from 'electron-devtools-installer';
// import { install as devtronInstall } from 'devtron';


const main = join(__dirname, '../src/browser/main.js');
const watch = [
  join(__dirname, '../src/browser'),
];

const pathCore = join(__dirname, '../../core/lib');
try {
  fs.accessSync(pathCore, fs.F_OK);
  watch.push(pathCore);
} catch (err) {
  console.log('Not watching changes on unified-dataloader-core');
}

// https://stackoverflow.com/a/45064488/4106215
/*
const installExtensions = async () => {
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    devtoolsInstaller.REACT_DEVELOPER_TOOLS,
    devtoolsInstaller.REDUX_DEVTOOLS
  ];
  return Promise.all(extensions.map(name => devtoolsInstaller(name, forceDownload)))
    .catch(console.log);
};

electron.app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development') {
    // await installExtensions();
    devtronInstall();
  }
  // createWindow();
});
*/

require('spawn-auto-restart')({
  debug: true,
  proc: {
    command: electron,
    args: [main, '--dev'],
  },
  watch: watch,
});
