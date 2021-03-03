/* eslint no-var: 0, prefer-arrow-callback:0 */
/**
 * Inject global configurations in the renderer process.
 *
 */

import { getConfig } from './config';
import { Config } from '../common/types/config';

declare global {
  interface Window {
    SQLECTRON_CONFIG: Config;
  }
}

process.once('loaded', function onLoaded() {
  global.window.SQLECTRON_CONFIG = getConfig();
});
