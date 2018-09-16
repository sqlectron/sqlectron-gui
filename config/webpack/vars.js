/*
eslint-disable
  max-len,
  import/newline-after-import,
  import/first,
  import/order,
  import/no-dynamic-require
*/
import { join, resolve } from 'path';
import fs from 'fs';
// const fs = require('fs');
// const { resolve, join } = require('path');

const ROOT_DIR = resolve(join(__dirname, '../..'));
// The dependencies block from vars.ROOT_DIR/package.json
const { dependencies } = require(join(ROOT_DIR, 'package.json'));
const JS_SRC = 'src';
const TS_SRC = 'typescriptrewritesrc';
const ENABLE_TYPESCRIPT = false;
const OPEN_ANALYZER = typeof process.env.OPEN_ANALYZER !== 'undefined'
  ? ['1', 'true', 'y', 'yes'].indexOf(process.env.OPEN_ANALYZER.toLowerCase()) !== -1
  : false;

// Find all the dependencies without a `main` property and add them as webpack externals
function filterDepWithoutEntryPoints(dep) {
  // Return true if we want to add a dependency to externals
  try {
    // If the root of the dependency has an index.js, return true
    if (fs.existsSync(join(ROOT_DIR, 'node_modules', dep, 'index.js'))) {
      return false;
    }
    const pgkString = fs
      .readFileSync(join(ROOT_DIR, 'node_modules', dep, 'package.json'))
      .toString();
    const pkg = JSON.parse(pgkString);
    const fields = ['main', 'module', 'jsnext:main', 'browser'];
    return !fields.some(field => field in pkg);
  }
  catch (e) {
    // console.log(e);
    return true;
  }
}

export {
  dependencies,
  filterDepWithoutEntryPoints,
  ROOT_DIR,
  JS_SRC,
  TS_SRC,
  ENABLE_TYPESCRIPT,
  OPEN_ANALYZER
};
