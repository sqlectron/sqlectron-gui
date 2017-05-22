#!/usr/bin/env node
/* eslint no-var: 0, object-shorthand:0 */
var fs = require('fs');
var join = require('path').join;

var pathSecret = join(__dirname, '../out/browser/secret');

var cryptoSecret = process.env.SQLECTRON_SECRET;
if (!cryptoSecret) {
  throw new Error('Missing SQLECTRON_SECRET');
}

fs.writeFileSync(pathSecret, cryptoSecret);
