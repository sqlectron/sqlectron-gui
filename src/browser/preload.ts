/**
 * Expose remote modules to the renderer process.
 */
import { ipcRenderer, contextBridge } from 'electron';

// Adds an object 'sqlectron' to the global window object:
contextBridge.exposeInMainWorld('sqlectron', {
  openNewConnectionWindow: () => ipcRenderer.invoke('openNewConnectionWindow'),
});
