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
    console.error('error', e.stack || e.message || e);
    throw e;
  }
}
