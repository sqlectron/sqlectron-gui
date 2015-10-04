import { platform, arch } from 'os';
import { existsSync } from 'fs';
import { spawn } from 'child_process';
import { join } from 'path';

/**
 * This script runs the local release based in the current platform and arch
 */
const ROOT_PATH = join(__dirname, '..');
const RELEASE_MAIN_PATH = `releases/SQLECTRON-${platform()}-${arch()}/SQLECTRON.app/Contents/Resources/app/build/main.js`;


if (!existsSync(RELEASE_MAIN_PATH, { cwd: ROOT_PATH })) {
  console.log('skipping because there is not a local release');
  process.exit(1);
}


const electron = spawn('electron', [RELEASE_MAIN_PATH], { cwd: ROOT_PATH });


electron.stdout.pipe(process.stdout);
electron.stderr.pipe(process.stderr);


electron.on('close', function (code) {
  console.log('child process exited with code ' + code);
  process.exit(code);
});
