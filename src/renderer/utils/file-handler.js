import fs from 'fs';
import { remote } from 'electron';


export function showSaveDialog(filters) {
  return new Promise((resolve, reject) => {
    remote.dialog.showSaveDialog({
      filters: filters,
    }, function (fileName) {
      if (fileName) {
        return resolve(fileName);
      }

      return reject();
    });
  });
}


export function saveFile(fileName, data, encoding = 'utf8') {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, encoding, (err) => {
      if (err) { return reject(err); }
      resolve();
    });
  });
}


export function showOpenDialog(filters, defaultPath) {
  return new Promise((resolve, reject) => {
    remote.dialog.showOpenDialog({
      defaultPath: defaultPath,
      filters: filters,
      properties: ['openFile'],
    }, function (fileName) {
      if (fileName) {
        return resolve(fileName);
      }

      return reject();
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
