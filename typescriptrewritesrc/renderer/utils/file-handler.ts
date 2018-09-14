/**
 * unified-dataloader-gui
 * Copyright (C) 2018 Armarti Industries
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import fs from 'fs';
import { remote } from 'electron'; // eslint-disable-line import/no-unresolved


export function showSaveDialog(filters) {
  return new Promise((resolve, reject) => {
    remote.dialog.showSaveDialog({
      filters,
    }, (fileName) => {
      if (fileName) {
        return resolve(fileName);
      }

      return reject();
    });
  });
}


export function saveFile(fileName, data, encoding = 'utf8') {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, encoding, err => {
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
    }, (fileName) => {
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
