import { LODAD_CONNECTIONS } from '../constants/action-types';


export function loadConnections() {
  const connections = [
    {
      name: 'My Postgres Connection',
      host: 'localhost',
      port: '5432',
      password: '123456',
      database: 'mydb',
      ssh: {
        host: 'myhost.com',
        port: '22',
        user: 'myuser',
        password: '123456',
        privateKey: '~/.ssh/id_rsa'
      }
    },
    {
      name: 'My MySQL Connection',
      host: 'localhost',
      port: '3306',
      password: '123456',
      database: 'mydb'
    }
  ];
  return { type: LODAD_CONNECTIONS, connections };
}
