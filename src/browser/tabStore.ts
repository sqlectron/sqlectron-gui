import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import Store from './store';
import { Tab } from '../common/types/tab';

export default class TabStore {
  store: Store;
  basePath: string;

  constructor() {
    this.store = new Store({ configName: 'tabs' });
    this.basePath = path.join(this.store.userDataPath, 'tabs');
  }

  loadTabs(serverId: string, databaseName: string): Array<Tab> {
    const tabsMap = this.store.data;
    const tabs = Object.values(tabsMap) as Array<Tab>;
    return (
      tabs
        // Find all tabs for this database
        .filter((tab: Tab) => tab.serverId === serverId && tab.databaseName === databaseName)
    );
  }

  loadTabContent(tab: Tab): string | undefined {
    if (tab.type === 'sql') {
      const filePath = this.tabContentPath(tab.id);
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath).toString();
      }
    }
  }

  removeTab(tab: Tab): void {
    if (tab.type === 'sql') {
      const filePath = this.tabContentPath(tab.id);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    this.store.del(tab.id);
  }

  getTab(tabId: string): Tab {
    return this.store.get(tabId);
  }

  tabContentPath(tabId: string): string {
    return path.join(this.basePath, tabId + '.sql');
  }

  createTab(serverId: string, databaseName: string, type: string): Tab {
    const tab = {
      type,
      serverId,
      databaseName,
      id: uuidv4(),
      sort: 0,
      name: type === 'sql' ? 'SQL' : 'Unknown',
    };

    this.store.set(tab.id, tab);
    console.log('****created tab', tab);

    return tab;
  }

  saveTabContent(tab: Tab, content: string): void {
    console.log('***set tab', this.tabContentPath(tab.id));
    this.store.set(tab.id, tab);

    if (tab.type === 'sql') {
      if (!fs.existsSync(this.basePath)) {
        fs.mkdirSync(this.basePath);
      }
      fs.writeFileSync(this.tabContentPath(tab.id), content);
    }
  }
}
