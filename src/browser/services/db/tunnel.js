import net from 'net';
import { Client } from 'ssh2';
import { getPort, readFile } from '../../utils';


const debug = require('../../debug')('services:db:clients:postgresql');


export default function(serverInfo) {
  return new Promise(async (resolve, reject) => {
    debug('building ssh tunnel configuration %j', serverInfo);
    const config = await _configTunnel(serverInfo);
    debug('ssh tunnel configuration %j', config);

    const connections = [];

    debug('creating ssh server');
    const server = net.createServer(async conn => {
      debug('created ssh server');
      conn.on('error', err => server.emit('error', err));

      const client = new Client();
      connections.push(conn);

      client.on('error', err => server.emit('error', err));

      client.on('ready', () => {
        debug('connected ssh client');
        connections.push(client);
        client.forwardOut(
          config.srcHost,
          config.srcPort,
          config.dstHost,
          config.dstPort,
          (err, sshStream) => {
            if (err) {
              server.close();
              server.emit('error', err);
              return;
            }
            sshStream.once('close', () => {
              server.close();
            });
            conn.pipe(sshStream).pipe(conn);
          });
      });

      try {
        const localPort = await getPort();
        debug('connecting client ssh');
        client.connect({ ...config, localPort });
      } catch (err) {
        server.emit('error', err);
      }
    });

    server.once('close', () => {
      debug('closed ssh server connetion');
      connections.forEach(conn => conn.end());
    });

    server.listen(config.localPort, config.localHost, err => {
      if (err) return reject(err);
      resolve(server);
    });
  });
}


async function _configTunnel(serverInfo) {
  const config = {
    username: serverInfo.ssh.user,
    port: serverInfo.ssh.port,
    host: serverInfo.ssh.host,
    dstPort: serverInfo.port,
    dstHost: serverInfo.host,
    sshPort: 22,
    srcPort: 0,
    srcHost: 'localhost',
    localHost: 'localhost',
  };
  if (serverInfo.ssh.password) config.password = serverInfo.ssh.password;
  if (serverInfo.ssh.privateKey) {
    config.privateKey = await readFile(serverInfo.ssh.privateKey);
  }
  return config;
}
