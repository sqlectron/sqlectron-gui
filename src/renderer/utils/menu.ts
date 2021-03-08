import { sqlectron } from '../api';

export type MenuCommands = {
  [command: string]: () => void;
};

export default class MenuHandler {
  commands: MenuCommands = {};
  unsubs: Array<() => void> = [];

  setMenus(commands: MenuCommands) {
    if (this.commands) {
      this.dispose();
    }

    const { onMenuClick } = sqlectron.browser.menu;

    this.unsubs = Object.keys(commands).map((command) => onMenuClick(command, commands[command]));

    this.commands = commands;
  }

  dispose() {
    this.unsubs.forEach((unsub) => unsub());

    this.commands = {};
  }
}
