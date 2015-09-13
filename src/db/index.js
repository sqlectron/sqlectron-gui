/**
 * Important:
 * ----------
 * Since this module uses APIs not available in the render process.
 * To use it you must require it through the remote module.
 * https://github.com/atom/electron/blob/master/docs/api/remote.md
 */
import conn from 'sqlectron-db';


let db = null;
export function getDB () {
  if (db) { return Promise.resolve(db); }
  try {
    return conn('pg', {
      host: '10.10.10.10',
      user: 'user',
      password: 'password',
      database: 'postgres',
    });
  } catch (e) {
    console.error(e.message || e);
  }
}
