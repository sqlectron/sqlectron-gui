import { exec } from 'child_process';
import { join } from 'path';
import denodeify from 'denodeify';
import webpack from 'webpack';
import del from 'del';
import webpackConfig from '../webpack.prod.config';

/**
 * Script arguments:
 * ===============================================
 * -v             verbose (default=false)
 */
const argv = require('minimist')(process.argv.slice(2), { boolean: ['v'] });
const ROOT_PATH = join(__dirname, '..');
const BUILD_PATH = join(ROOT_PATH, 'app/out');


/**
 * Build browser code with babel
 */
async function buildBrowserCode() {
  const browserBuildPath = join(BUILD_PATH, 'browser');
  return denodeify(exec).call(exec, `babel ./src/browser -d ${browserBuildPath}`, { cwd: ROOT_PATH });
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
 * Executes the whole build process
 */
(async function startPack() {
  try {
    console.log('> cleaning old distribution files');
    await del([ BUILD_PATH ]);

    console.log('> building browser code with babel');
    await buildBrowserCode();

    console.log('> building renderer code with webpack');
    await buildRendererCode();

    console.log('>> success');
  } catch (err) {
    console.log('>> error', err.stack || err);
    process.exit(1);
  }
})();
