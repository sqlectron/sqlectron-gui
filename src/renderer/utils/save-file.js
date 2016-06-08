import fs from 'fs';
import { remote } from 'electron';


export function showSaveDialog(filters) {
  return new Promise((resolve, reject) => {
    remote.dialog.showSaveDialog({
      filters: filters,
    }, function (filename) {
      if (filename) {
        return resolve(filename);
      }

      return reject();
    });
  });
}


export function saveFile(filename, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, 'utf8', (err) => {
      if (err) { return reject(err); }
      resolve();
    });
  });
}
