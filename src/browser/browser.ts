import fs from 'fs';
import electron, {
  Menu,
  MenuItem,
  IpcMainInvokeEvent,
  IpcMainEvent,
  shell,
  clipboard,
} from 'electron';
import { DB_CLIENTS } from './core/db';
import * as eventKeys from '../common/event';

import {
  SqlectronBrowser,
  SqlectronBrowserDialog,
  SqlectronBrowserFS,
  SqlectronBrowserMenu,
  SqlectronBrowserShell,
  SqlectronBrowserClipboard,
  SqlectronBrowserWebFrame,
  DialogFilter,
} from '../common/types/api';

const dialogFacade: SqlectronBrowserDialog = {
  showSaveDialog: async (filters: Array<DialogFilter>): Promise<string> => {
    const dialogObject = await electron.dialog.showSaveDialog({
      filters,
    });

    return dialogObject.canceled ? '' : (dialogObject.filePath as string);
  },

  showOpenDialog: async (filters: Array<DialogFilter>, defaultPath?: string): Promise<string[]> => {
    const dialogObject = await electron.dialog.showOpenDialog({
      defaultPath,
      filters,
      properties: ['openFile'],
    });

    if (dialogObject.canceled || dialogObject.filePaths.length === 0) {
      return [];
    }

    return dialogObject.filePaths;
  },
};

const fsFacade: SqlectronBrowserFS = {
  saveFile: (fileName: string, data: unknown, encoding = 'utf8'): Promise<void> => {
    return new Promise((resolve, reject) => {
      fs.writeFile(fileName, data, encoding, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  },
  openFile: (fileName: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  },
};

let contextMenuDatabaseItem: Menu | null = null;
let contextMenuDatabaseListItem: Menu | null = null;
let contextMenuTableCell: Menu | null = null;

const menuFacade: SqlectronBrowserMenu = {
  buildContextMenuDatabaseItem: ({
    client,
    database,
    item,
    dbObjectType,
    event,
  }: {
    client: string;
    database: string;
    item: unknown;
    dbObjectType: string;
    event?: IpcMainInvokeEvent;
  }) => {
    contextMenuDatabaseItem = new Menu();
    if (dbObjectType === 'Table' || dbObjectType === 'View') {
      contextMenuDatabaseItem?.append(
        new MenuItem({
          label: 'Select Rows (with limit)',
          click: () => event?.sender.send('onExecuteDefaultQuery', database, item),
        }),
      );
    }

    contextMenuDatabaseItem?.append(new MenuItem({ type: 'separator' }));

    const { disabledFeatures } = DB_CLIENTS.find((dbClient) => dbClient.key === client);
    if (!disabledFeatures || !disabledFeatures.includes('scriptCreateTable')) {
      contextMenuDatabaseItem?.append(
        new MenuItem({
          label: 'Create Statement',
          click: () => event?.sender.send('onGetSQLScript', database, item, 'CREATE', dbObjectType),
        }),
      );
    }

    if (dbObjectType === 'Table') {
      const actionTypes = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
      const labelsByTypes = {
        SELECT: 'Select Statement',
        INSERT: 'Insert Statement',
        UPDATE: 'Update Statement',
        DELETE: 'Delete Statement',
      };

      actionTypes.forEach((actionType) => {
        contextMenuDatabaseItem?.append(
          new MenuItem({
            label: labelsByTypes[actionType],
            click: () =>
              event?.sender.send('onGetSQLScript', database, item, actionType, dbObjectType),
          }),
        );
      });
    }
  },

  popupContextMenuDatabaseItem: (x: number, y: number) => {
    contextMenuDatabaseItem?.popup({ x, y });
  },

  buildContextMenuDatabaseListItem: ({
    database,
    event,
  }: {
    database: string;
    event?: IpcMainInvokeEvent;
  }) => {
    contextMenuDatabaseListItem = new Menu();
    contextMenuDatabaseListItem.append(
      new MenuItem({
        label: 'Refresh Database',
        click: () => event?.sender.send('onRefreshDatabase', database),
      }),
    );
    contextMenuDatabaseListItem.append(
      new MenuItem({
        label: 'Open Tab',
        click: () => event?.sender.send('onOpenTab', database),
      }),
    );
    contextMenuDatabaseListItem.append(
      new MenuItem({
        label: 'Show Database Diagram',
        click: () => event?.sender.send('onShowDiagramModal', database),
      }),
    );
  },

  popupContextMenuDatabaseListItem: (x: number, y: number) => {
    contextMenuDatabaseListItem?.popup({ x, y });
  },

  buildContextMenuTableCell: ({ event }: { event?: IpcMainEvent }) => {
    contextMenuTableCell = new Menu();
    contextMenuTableCell.append(
      new MenuItem({
        label: 'Open Preview',
        click: () => event?.sender.send(eventKeys.BROWSER_MENU_OPEN_PREVIEW),
      }),
    );
  },
  popupContextMenuTableCell: (x: number, y: number) => {
    contextMenuTableCell?.popup({ x, y });
  },
  onPreviewTableCell: (cb: () => void) => cb(),

  onZoomIn: (cb: () => void) => cb(),
  onZoomOut: (cb: () => void) => cb(),
  onZoomReset: (cb: () => void) => cb(),

  onQueryExecute: (cb: () => void) => cb(),
  onNewTab: (cb: () => void) => cb(),
  onCloseTab: (cb: () => void) => cb(),
  onSaveQuery: (cb: () => void) => cb(),
  onSaveQueryAs: (cb: () => void) => cb(),
  onOpenQuery: (cb: () => void) => cb(),
  onQueryFocus: (cb: () => void) => cb(),
  onToggleDatabaseSearch: (cb: () => void) => cb(),
  onToggleDatabaObjectsSearch: (cb: () => void) => cb(),
};

const shellFacade: SqlectronBrowserShell = {
  openExternal: (url: string): Promise<void> => shell.openExternal(url),
};

const clipboardFacade: SqlectronBrowserClipboard = {
  writeText: (text: string): void => clipboard.writeText(text),
};

const webFrameFacade: SqlectronBrowserWebFrame = {
  setZoomFactor: (zoom: number, event?: IpcMainInvokeEvent): void =>
    event?.sender.setZoomFactor(zoom),
};

const browserFacade: SqlectronBrowser = {
  dialog: dialogFacade,
  fs: fsFacade,
  menu: menuFacade,
  shell: shellFacade,
  clipboard: clipboardFacade,
  webFrame: webFrameFacade,
};

export default browserFacade;
