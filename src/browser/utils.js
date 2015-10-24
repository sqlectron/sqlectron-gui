import fs from 'fs';
import path from 'path';
import pf from 'portfinder';


export function homedir() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}


export function wait (time) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), time);
  });
}


export function getPort () {
  return new Promise((resolve, reject) => {
    pf.getPort({ host: '127.0.0.1' }, (err, port) => {
      if (err) return reject(err);
      resolve(port);
    });
  });
}


export function readFile (filename) {
  let fullPath = filename;
  if (/^~\//.test(filename)) {
    fullPath = path.join(homedir(), filename.substring(2));
  }
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(fullPath), (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}
