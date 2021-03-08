import { sqlectron } from '../api';
import { MenuItem } from '../../common/types/api';

export interface MenuItemOption {
  type: string;
  label: string;
  event: string;
  click?: () => void;
}

export default class ContextMenu {
  menuId: string;
  isMenuBuilt = false;
  items: MenuItemOption[] = [];
  unsubs: Array<() => void> = [];

  constructor(menuId: string) {
    this.menuId = menuId;
  }

  append(item: MenuItemOption): void {
    if (this.isMenuBuilt) {
      throw new Error(`Cannot append to context menu ${this.menuId}, it is already built`);
    }

    this.items.push(item);

    if (item.click) {
      // Scope channel by menuID to avoid conflicts for multiple context menus registered at same time
      const eventKey = `${item.event}@${this.menuId}`;
      const unsub = sqlectron.browser.menu.onMenuClick(eventKey, () => {
        if (item.click) {
          item.click();
        }
      });

      this.unsubs.push(unsub);
    }
  }

  build(): void {
    if (this.isMenuBuilt) {
      throw new Error(`Cannot build context menu ${this.menuId}, it is already built`);
    }

    this.isMenuBuilt = true;

    sqlectron.browser.menu.buildContextMenu(this.menuId, {
      menuItems: this.items.map((item: MenuItemOption) => {
        // Omits the click function because it is passed by IPC to the browser process
        // and it cannot serialize a function. The click function is setup by the append
        // fucntion binding it to a event listener which then triggers the click function
        // when the browser process detects a click in the context menu.
        const menuItem: MenuItem = {
          type: item.type,
          label: item.label,
          event: item.event,
        };

        return menuItem;
      }),
    });
  }

  popup({ x, y }: { x: number; y: number }): void {
    if (!this.isMenuBuilt) {
      throw new Error(`Cannot open context menu ${this.menuId}, it is not built yet`);
    }

    sqlectron.browser.menu.popupContextMenu(this.menuId, {
      x,
      y,
    });
  }

  dispose() {
    this.unsubs.forEach((unsub) => unsub());
  }
}
