#!/usr/bin/env node
/* eslint no-var: 0, object-shorthand:0 */
var fs = require('fs');
var join = require('path').join;
var electron = require('electron');

const main = join(__dirname, '../src/browser/main.js');
const watch = [
  join(__dirname, '../src/browser'),
];

const pathCore = join(__dirname, '../../unified-dataloader-core/lib');
try {
  fs.accessSync(pathCore, fs.F_OK);
  watch.push(pathCore);
} catch (err) {
  console.log('Not watching changes on unified-dataloader-core');
}


require('spawn-auto-restart')({
  debug: true,
  proc: {
    command: electron,
    args: [main, '--dev', '--remote-debugging-port=9222'],
  },
  watch: watch,
});
