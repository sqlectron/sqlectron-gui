/**
 * Important:
 * ----------
 * Since this current module uses APIs not available in the render process.
 * To use it you must require it through the remote module.
 * https://github.com/atom/electron/blob/master/docs/api/remote.md
 */
import conn from 'sqlectron-db';


let connection = null;
export async function getDBSession () {
  if (connection) { return connection; }
  try {
    // connection = await conn('mysql', {
    //   debug: true,
    //   host: '10.10.10.10',
    //   user: 'root',
    //   password: 'password',
    //   database: 'authentication'
    // });
    connection = await conn('pg', {
      host: '10.10.10.10',
      user: 'user',
      password: 'password',
      database: 'postgres',
    });
    return connection;
  } catch (e) {
    console.error(e.message || e);
  }
}
