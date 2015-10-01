import os from 'os';
import { escapeRegExp } from 'lodash';
import { readdirSync } from 'fs';
import { exec } from 'child_process';
import { join } from 'path';
import denodeify from 'denodeify';
import webpack from 'webpack';
import packager from 'electron-packager';
import del from 'del';
import pkg from '../package.json';
import webpackConfig from '../webpack.prod.config';

/**
 * Script arguments:
 * ===============================================
 * -v       verbose (default=false)
 * --all    build for all platforms (default=true)
 */
const argv = require('minimist')(process.argv.slice(2), { boolean: ['all', 'v'] });
const BUILD_PATH = join(__dirname, '../build');
const RELEASE_PATH = join(__dirname, '../releases');
const RESOURCES_PATH = join(__dirname, '../resources');


/**
 * Cross platform options for electron-packager
 */
const ELECTRON_PACKAGER_OPTS = {
  name: pkg.productName,
  'app-version': pkg.version,
  'app-bundle-id': pkg.appBundleId,
  'helper-bundle-id': pkg.helperBundleId,
  version: pkg.devDependencies['electron-prebuilt'].replace('^', ''),
  asar: false,
  prune: true,
  overwrite: true,
  dir: '.',
  out: RELEASE_PATH,
  ignore: [
    // ignores everything we don't need in the release app
    readdirSync(join(__dirname, '..'))
      .filter(filename => !~['node_modules', 'build', 'package.json'].indexOf(filename))
      .map(filename => new RegExp(`^${escapeRegExp(filename)}$`))
  ]
};


/**
 * Supported platforms and platfrom specific options
 */
const TASKS = [
  { platform: 'darwin', arch: 'x64', icon: 'app.icns' }
].map(item => {
  return {
    ...item,
    ...ELECTRON_PACKAGER_OPTS,
    icon: join(RESOURCES_PATH, item.icon)
  };
});


/**
 * Build browser code with babel
 */
async function buildBrowserCode() {
  return denodeify(exec).call(exec, `babel ../src/browser -d ${BUILD_PATH}`, { cwd: __dirname });
}


/**
 * Build assets through webpack
 */
async function buildRendererCode() {
  const stats = await denodeify(webpack).call(webpack, webpackConfig);
  if (argv.v) {
    console.log(stats.toString({ colors: true }));
  }
}


/**
 * Package electron app through electron-packager
 */
async function packElectronApp(opts) {
  return denodeify(packager).call(packager, opts);
}


/**
 * Executes the whole build process
 */
(async function startPack() {
  try {
    console.log('> cleaning old builds and releases');
    await del([ BUILD_PATH, RELEASE_PATH ]);

    console.log('> building browser code with babel');
    await buildBrowserCode();

    console.log('> building renderer code with webpack');
    await buildRendererCode();

    console.log('> packaging electron app');
    for (let task of TASKS) {
      await packElectronApp(task);
    }

    console.log('>> success');
  } catch (err) {
    console.log('>> error', err.stack);
  }
})();
