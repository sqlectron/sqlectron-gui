#!/usr/bin/env node
const fs = require('fs');
const { join } = require('path');
const electron = require('electron');

const main = join(__dirname, '../out/browser/main.js');
const watch = [join(__dirname, '../out/browser')];

const pathCore = join(__dirname, '../../sqlectron-core/lib');
try {
  fs.accessSync(pathCore, fs.F_OK);
  watch.push(pathCore);
} catch (err) {
  console.log('Not watching changes on sqlectron-core');
}

require('spawn-auto-restart')({
  debug: true,
  proc: {
    command: electron,
    args: [main, '--dev'],
  },
  watch,
});
