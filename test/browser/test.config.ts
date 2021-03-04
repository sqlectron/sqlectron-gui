import path from 'path';
import { expect } from 'chai';
import { config } from '../../src/browser/core';
import { readJSONFile } from '../../src/browser/core/utils';
import { decrypt } from '../../src/browser/core/crypto';
import { EncryptedPassword } from '../../src/common/types/server';
import utilsStub from './utils-stub';

const cryptoSecret = 'CHK`Ya91Hs{me!^8ndwPPaPPxwQ}`';

describe('config', () => {
  utilsStub.getConfigPath.install({ copyFixtureToTemp: true });

  describe('.prepare', () => {
    it('should include id for those servers without it', async () => {
      const findItem = (data) => data.servers.find((srv) => srv.name === 'without-id');

      const fixtureBefore = await loadConfig();
      await config.prepare(cryptoSecret);
      const fixtureAfter = await loadConfig();

      expect(findItem(fixtureBefore)).to.not.have.property('id');
      expect(findItem(fixtureAfter)).to.have.property('id');
      const expected = await readJSONFile(
        path.join(__dirname, '../fixtures/browser/sqlectron.prepared.json'),
      );
      expect(fixtureAfter.servers).to.be.same.length(expected.servers.length);
      fixtureAfter.servers[0].id = expected.servers[0].id;
      for (let i = 0; i < fixtureAfter.servers.length; i++) {
        const expectedServer = expected.servers[i];
        const actualServer = fixtureAfter.servers[i];
        if (expectedServer.password) {
          expect(decrypt(expected.servers[i].password as EncryptedPassword, cryptoSecret)).to.equal(
            decrypt(actualServer.password as EncryptedPassword, cryptoSecret),
          );
          expectedServer.password = '';
          actualServer.password = '';
        }

        if (expectedServer.ssh && expectedServer.ssh.password) {
          expect(decrypt(expectedServer.ssh.password as EncryptedPassword, cryptoSecret)).to.equal(
            decrypt(actualServer.ssh!.password as EncryptedPassword, cryptoSecret),
          );
          expectedServer.ssh.password = '';
          actualServer.ssh!.password = '';
        }

        expect(expectedServer).to.eql(actualServer);
      }
    });
  });

  function loadConfig() {
    return readJSONFile(utilsStub.TMP_FIXTURE_PATH);
  }
});
