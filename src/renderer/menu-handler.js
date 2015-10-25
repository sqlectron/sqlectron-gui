import ipc from 'ipc';


export default class MenuHandler {
  setMenus(commands) {
    if (this.commands) {
      this.removeAllMenus();
    }

    Object.keys(commands)
      .forEach(command => ipc.on(command, commands[command]));

    this.commands = commands;
  }

  removeAllMenus() {
    Object.keys(this.commands)
      .forEach(command => ipc.removeListener(command, this.commands[command]));

    this.commands = null;
  }
}
