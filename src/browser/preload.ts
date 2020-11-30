/**
 * Expose remote modules to the renderer process.
 */
import { ipcRenderer, contextBridge } from 'electron';

// Adds an object 'sqlectron' to the global window object:
contextBridge.exposeInMainWorld('sqlectron', {
  openNewConnectionWindow: () => ipcRenderer.invoke('openNewConnectionWindow'),
  config: {
    load: () => ipcRenderer.invoke('config.load'),
  },
  db: {
    listTables: () => ipcRenderer.invoke('db.listTables'),
    connect: (
      id: string,
      databaseName: string,
      reconnecting: boolean,
      sshPassphrase: string,
    ) =>
      ipcRenderer.invoke(
        'db.connect',
        id,
        databaseName,
        reconnecting,
        sshPassphrase,
      ),
  },
});
