import fs from 'fs';
import { remote } from 'electron'; // eslint-disable-line import/no-unresolved

export function showSaveDialog(filters) {
  return new Promise((resolve, reject) => {
    remote.dialog.showSaveDialog({
      filters,
    }).then((dialogObject) => {
      if (dialogObject.canceled) {
        return reject();
      }
      return resolve(dialogObject.filePath);
    }).catch((err) => {
      reject(err);
    });
  });
}

export function saveFile(fileName, data, encoding = 'utf8') {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, encoding, (err) => {
      if (err) { return reject(err); }
      return resolve();
    });
  });
}

export function showOpenDialog(filters, defaultPath) {
  return new Promise((resolve, reject) => {
    remote.dialog.showOpenDialog({
      defaultPath,
      filters,
      properties: ['openFile'],
    }).then((dialogObject) => {
      if (dialogObject.canceled || dialogObject.filePaths.length === 0) {
        return reject();
      }
      return resolve(dialogObject.filePaths);
    }).catch((err) => {
      reject(err);
    });
  });
}

export function openFile(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) { return reject(err); }
      return resolve(data);
    });
  });
}
