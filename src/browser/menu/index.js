import Menu from 'menu';


const menus = {
  darwin: require('./darwin'),
  linux: require('./linux'),
  win32: require('./win32'),
};


export function attachMenuToWindow(app, buildNewWindow, appConfig) {
  const template = menus[process.platform].buildTemplate(app, buildNewWindow, appConfig);
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
