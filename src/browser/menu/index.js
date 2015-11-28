import Menu from 'menu';


const menus = {
  darwin: require('./darwin'),
  linux: require('./linux'),
  win32: require('./win32'),
};


export function attachMenuToWindow(app, mainWindow) {
  const template = menus[process.platform].buildTemplate(app, mainWindow);
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
