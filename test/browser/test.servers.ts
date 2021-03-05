import { expect } from 'chai';
import { servers } from '../../src/browser/core';
import { readJSONFile } from '../../src/browser/core/utils';
import * as crypto from '../../src/browser/core/crypto';
import { Server } from '../../src/common/types/server';
import utilsStub from './utils-stub';

const cryptoSecret = 'CHK`Ya91Hs{me!^8ndwPPaPPxwQ}`';

function assertPassword(newServer, createdServer) {
  /* eslint no-param-reassign: 0 */
  expect(createdServer).to.have.property('password').to.have.keys(['ivText', 'encryptedText']);
  expect(crypto.decrypt(createdServer.password, cryptoSecret)).to.eql(newServer.password);
  newServer.encrypted = true;
  delete createdServer.password;
  delete newServer.password;
}

describe('servers', () => {
  utilsStub.getConfigPath.install({ copyFixtureToTemp: true });

  describe('.getAll', () => {
    it('should load servers from file', async () => {
      const fixture = await loadConfig();
      const result = await servers.getAll();

      // DO NOT decrypt assert data
      const encryptedServer1 = fixture.servers.find(
        (srv) => srv.id === '65f36ca9-331f-43b3-ab38-3f5556fd65ce',
      ) as Server;
      encryptedServer1.encrypted = true;
      encryptedServer1.password = 'fa1d88ee82bd4439';

      const encryptedServer2 = fixture.servers.find(
        (srv) => srv.id === '179d7c6e-2d7c-4c86-b203-d901b7dfea77',
      ) as Server;
      encryptedServer2.encrypted = true;
      encryptedServer2.password = 'fa1d88ee82bd4439';
      encryptedServer2.ssh!.password = 'fa1d88ee82bd4439';

      expect(result).to.eql(fixture.servers);
    });
  });

  describe('.add', () => {
    it('should add new server', async () => {
      const configBefore = await loadConfig();
      const newServer: Server = {
        id: '',
        name: 'My New Mysql Server',
        client: 'mysql',
        ssl: false,
        host: '10.10.10.15',
        port: 3306,
        database: 'authentication',
        user: 'root',
        password: 'password',
      };
      const createdServer = await servers.add(newServer, cryptoSecret);
      expect(createdServer).to.have.property('id');
      createdServer.id = '';
      assertPassword(newServer, createdServer);
      expect(createdServer).to.eql(newServer);

      const configAfter = await loadConfig();
      expect(configAfter.servers.length).to.eql(configBefore.servers.length + 1);
    });

    it('should add new server with ssh', async () => {
      const configBefore = await loadConfig();
      const newServer: Server = {
        id: '',
        name: 'My New Mysql Server',
        client: 'mysql',
        ssl: false,
        host: '10.10.10.15',
        port: 3306,
        database: 'authentication',
        user: 'root',
        password: 'password',
        ssh: {
          host: '10.10.10.10',
          port: 22,
          user: 'root',
          privateKey: '~/.ssh/id_rsa',
          password: {
            ivText: 'wGf6X9T+QSygOHqtgQPlcA==',
            encryptedText: '0LySDs9WPAvwSS9Qv+W3/A==',
          },
          privateKeyWithPassphrase: true,
        },
      };
      const createdServer = await servers.add(newServer, cryptoSecret);
      expect(createdServer).to.have.property('id');
      createdServer.id = '';
      assertPassword(newServer, createdServer);
      expect(createdServer).to.eql(newServer);

      const configAfter = await loadConfig();
      expect(configAfter.servers.length).to.eql(configBefore.servers.length + 1);
    });
  });

  describe('.update', () => {
    it('should update existing server', async () => {
      const id = 'ed2d52a7-d8ff-4fdd-897a-7033dee598f4';
      const configBefore = await loadConfig();
      const serverToUpdate: Server = {
        id,
        name: 'mysql-vm',
        client: 'mysql',
        ssl: false,
        host: '10.10.10.10',
        port: 3306,
        database: 'mydb',
        user: 'usr',
        password: 'pwd',
      };
      const updatedServer = await servers.update(serverToUpdate, cryptoSecret);
      expect(updatedServer).to.eql(serverToUpdate);

      const configAfter = await loadConfig();
      expect(configAfter.servers.length).to.eql(configBefore.servers.length);
      const configServer = configAfter.servers.find((srv) => srv.id === id);
      assertPassword(serverToUpdate, configServer);
      expect(updatedServer).to.eql(configServer);
    });

    it('should upgrade oldstyle encrypted password', async () => {
      const id = '65f36ca9-331f-43b3-ab38-3f5556fd65ce';
      const configBefore = await loadConfig();
      const serverToUpdate: Server = {
        id,
        name: 'mysql-vm',
        client: 'mysql',
        ssl: false,
        host: '10.10.10.10',
        port: 3306,
        database: 'mydb',
        user: 'usr',
        password: 'fa1d88ee82bd4439',
      };
      const updatedServer = await servers.update(serverToUpdate, cryptoSecret);
      expect(updatedServer).to.eql(serverToUpdate);

      const configAfter = await loadConfig();
      expect(configAfter.servers.length).to.eql(configBefore.servers.length);
      serverToUpdate.password = 'password';
      const configServer = configAfter.servers.find((srv) => srv.id === id);
      assertPassword(serverToUpdate, configServer);
      expect(serverToUpdate).to.eql(configServer);
    });
  });

  it('should not update password when password is already encrypted', async () => {
    const id = '440d4fef-6fc8-4e53-ba84-f89c91d9c542';
    const configBefore = await loadConfig();
    const serverToUpdate: Server = {
      id,
      name: 'mysql-vm',
      client: 'mysql',
      ssl: false,
      host: '10.10.10.10',
      port: 3306,
      database: 'mydb',
      user: 'usr',
      password: {
        ivText: 'wGf6X9T+QSygOHqtgQPlcA==',
        encryptedText: '0LySDs9WPAvwSS9Qv+W3/A==',
      },
    };
    const updatedServer = await servers.update(serverToUpdate, cryptoSecret);
    expect(updatedServer).to.eql(serverToUpdate);

    const configAfter = await loadConfig();

    expect(configAfter.servers.length).to.eql(configBefore.servers.length);
    expect(configAfter.servers.find((srv) => srv.id === id)).to.eql({
      ...serverToUpdate,
      encrypted: true,
    });
  });

  describe('.addOrUpdate', () => {
    describe('given is a new server', () => {
      it('should add the new server', async () => {
        const configBefore = await loadConfig();
        const newServer: Server = {
          id: '',
          name: 'My New Mysql Server',
          client: 'mysql',
          ssl: false,
          host: '10.10.10.15',
          port: 3306,
          database: 'authentication',
          user: 'root',
          password: 'password',
        };
        const createdServer = await servers.addOrUpdate(newServer, cryptoSecret);
        expect(createdServer).to.have.property('id');
        createdServer.id = '';
        assertPassword(newServer, createdServer);
        expect(createdServer).to.eql(newServer);

        const configAfter = await loadConfig();
        expect(configAfter.servers.length).to.eql(configBefore.servers.length + 1);
      });
    });

    describe('given is an existing server', () => {
      it('should update this existing server', async () => {
        const configBefore = await loadConfig();
        const id = 'ed2d52a7-d8ff-4fdd-897a-7033dee598f4';
        const serverToUpdate: Server = {
          id,
          name: 'mysql-vm',
          client: 'mysql',
          ssl: false,
          host: '10.10.10.10',
          port: 3306,
          database: 'mydb',
          user: 'usr',
          password: 'pwd',
        };
        const updatedServer = await servers.addOrUpdate(serverToUpdate, cryptoSecret);
        expect(updatedServer).to.eql(serverToUpdate);

        const configAfter = await loadConfig();
        expect(configAfter.servers.length).to.eql(configBefore.servers.length);
        const configServer = configAfter.servers.find((srv) => srv.id === id);
        assertPassword(serverToUpdate, configServer);
        expect(updatedServer).to.eql(configServer);
      });
    });
  });

  describe('.remove', () => {
    it('should remove an existing server', async () => {
      const configBefore = await loadConfig();
      await servers.removeById('c94cbafa-8977-4142-9f34-c84d382d8731');

      const configAfter = await loadConfig();
      expect(configAfter.servers.length).to.eql(configBefore.servers.length - 1);
      expect(configAfter.servers.find((srv) => srv.name === 'pg-vm')).to.eql(undefined);
    });
  });

  describe('.decryptSecrets', () => {
    it('should decrypt new style password', () => {
      const encryptedServer: Server = {
        id: '',
        name: 'mysql-vm',
        client: 'mysql',
        ssl: false,
        host: '10.10.10.10',
        port: 3306,
        database: 'mydb',
        user: 'usr',
        encrypted: true,
        password: {
          ivText: 'wGf6X9T+QSygOHqtgQPlcA==',
          encryptedText: '0LySDs9WPAvwSS9Qv+W3/A==',
        },
      };
      const decryptedServer = servers.decryptSecrects(encryptedServer, cryptoSecret);

      encryptedServer.encrypted = false;
      encryptedServer.password = 'password';
      expect(decryptedServer).to.eql(encryptedServer);
    });

    it('should decrypt new style password for ssh', () => {
      const encryptedServer: Server = {
        id: '',
        name: 'mysql-vm',
        client: 'mysql',
        ssl: false,
        host: '10.10.10.10',
        port: 3306,
        database: 'mydb',
        user: 'usr',
        password: '',
        encrypted: true,
        ssh: {
          user: 'usr',
          host: 'localhost',
          port: 22,
          password: {
            ivText: 'wGf6X9T+QSygOHqtgQPlcA==',
            encryptedText: '0LySDs9WPAvwSS9Qv+W3/A==',
          },
        },
      };
      const decryptedServer = servers.decryptSecrects(encryptedServer, cryptoSecret);

      encryptedServer.encrypted = false;
      encryptedServer.ssh!.password = 'password';
      expect(decryptedServer).to.eql(encryptedServer);
    });

    it('should decrypt old style password', () => {
      const encryptedServer: Server = {
        id: '',
        name: 'mysql-vm',
        client: 'mysql',
        ssl: false,
        host: '10.10.10.10',
        port: 3306,
        database: 'mydb',
        user: 'usr',
        encrypted: true,
        password: 'fa1d88ee82bd4439',
      };
      const decryptedServer = servers.decryptSecrects(encryptedServer, cryptoSecret);

      encryptedServer.encrypted = false;
      encryptedServer.password = 'password';
      expect(decryptedServer).to.eql(encryptedServer);
    });

    it('should decrypt old style password for ssh', () => {
      const encryptedServer: Server = {
        id: '',
        name: 'mysql-vm',
        client: 'mysql',
        ssl: false,
        host: '10.10.10.10',
        port: 3306,
        database: 'mydb',
        user: 'usr',
        password: {
          ivText: 'wGf6X9T+QSygOHqtgQPlcA==',
          encryptedText: '0LySDs9WPAvwSS9Qv+W3/A==',
        },
        encrypted: true,
        ssh: {
          user: 'usr',
          host: 'localhost',
          port: 22,
          password: 'fa1d88ee82bd4439',
        },
      };
      const decryptedServer = servers.decryptSecrects(encryptedServer, cryptoSecret);

      encryptedServer.encrypted = false;
      encryptedServer.password = 'password';
      encryptedServer.ssh!.password = 'password';
      expect(decryptedServer).to.eql(encryptedServer);
    });

    it('should do nothing for unencrypted server', () => {
      const encryptedServer: Server = {
        id: '',
        name: 'mysql-vm',
        client: 'mysql',
        ssl: false,
        host: '10.10.10.10',
        port: 3306,
        database: 'mydb',
        user: 'usr',
        password: 'password',
      };
      expect(servers.decryptSecrects(encryptedServer, cryptoSecret)).to.eql(encryptedServer);
    });
  });

  function loadConfig() {
    return readJSONFile(utilsStub.TMP_FIXTURE_PATH);
  }
});
