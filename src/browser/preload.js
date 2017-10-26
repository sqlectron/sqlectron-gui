/* eslint no-var: 0, prefer-arrow-callback:0 */
/**
 * Inject global configurations in the renderer process.
 *
 * Since it is loaded directly from the renderer process,
 * without passing through a transpiler, this file must use ES5.
 */

var config = require('./config');


process.once('loaded', function onLoaded() {
  global.SQLECTRON_CONFIG = config.get();
});

