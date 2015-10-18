#!/usr/bin/env node
/* eslint no-var: 0 */
var join = require('path').join;
var electron = require('electron-prebuilt');


var main = join(__dirname, '../src/browser/main.js');
var watch = join(__dirname, '../src/browser');


require('spawn-auto-restart')({
  debug: true,
  proc: {
    command: electron,
    args: [main, '--dev'],
  },
  watch: watch,
});
