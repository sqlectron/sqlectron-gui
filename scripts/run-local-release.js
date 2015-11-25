import { platform, arch } from 'os';
import { existsSync } from 'fs';
import { spawn } from 'child_process';
import { join } from 'path';
import pkg from '../package.json';

/**
 * This script runs the local release based in the current platform and arch
 *
 * It only works if the app has been built it the current platform.
 * For example, building an app for OSX through a Linux will not work running
 * the app on OSX with this script.
 */
const ROOT_PATH = join(__dirname, '..');
const RELEASE_APP_PATH = `releases/SQLECTRON-${platform()}-${arch()}/SQLECTRON.app/Contents/Resources`;
const RELEASE_MAIN_PATH = join(RELEASE_APP_PATH, 'app', pkg.main);
const RELEASE_ASAR_PATH = join(RELEASE_APP_PATH, 'app.asar');


let appPath = '';
if (existsSync(RELEASE_MAIN_PATH, { cwd: ROOT_PATH })) {
  appPath = RELEASE_MAIN_PATH;
  console.log(`using ${pkg.main} file`);
} else if (existsSync(RELEASE_ASAR_PATH, { cwd: ROOT_PATH })) {
  appPath = RELEASE_ASAR_PATH;
  console.log('using app.asar file');
} else {
  console.log('skipping because there is not a local release');
  console.log('> ', RELEASE_MAIN_PATH);
  console.log('> ', RELEASE_ASAR_PATH);
  process.exit(1);
}


const electron = spawn('electron', [appPath], { cwd: ROOT_PATH });


electron.stdout.pipe(process.stdout);
electron.stderr.pipe(process.stderr);


electron.on('close', function onClose(code) {
  console.log('child process exited with code ' + code);
  process.exit(code);
});
