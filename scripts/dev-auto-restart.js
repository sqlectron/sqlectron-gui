#!/usr/bin/env node
/* eslint no-var: 0, object-shorthand:0 */
var fs = require('fs');
var join = require('path').join;
var electron = require('electron');


var main = join(__dirname, '../src/browser/main.js');
var watch = [
  join(__dirname, '../src/browser'),
];

var pathCore = join(__dirname, '../../sqlectron-core/lib');
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
  watch: watch,
});
