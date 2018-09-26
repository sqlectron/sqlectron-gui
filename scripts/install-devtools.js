const reduxDevtoolsPath = '/Users/dcmorse/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.15.3_0';
const reactDevtoolsPath = '/Users/dcmorse/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.4.0_0';
const { BrowserWindow } = require('electron').remote;
BrowserWindow.addDevToolsExtension(reactDevtoolsPath);
BrowserWindow.addDevToolsExtension(reduxDevtoolsPath);
