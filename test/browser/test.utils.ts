import { expect } from 'chai';
import { join } from 'path';
import { getConfigPath, versionCompare } from '../../src/browser/core/utils';

describe('utils', () => {
  describe('.versionCompare', () => {
    [
      ['8.0.2', '8.0.1', 1],
      ['8.0.2', '8.0.3', -1],
      ['8.0.2.', '8.1', -1],
      ['8.0.2', '8', 0],
      ['8.0', '8', 0],
      ['8', '8', 0],
      ['8', '8.0.2', 0],
      ['8', '8.0', 0],
      ['8.0.2', '12.3', -1],
      ['12.3', '8', 1],
      ['12', '8', 1],
      ['8', '12', -1],
    ].forEach(([versionA, versionB, expected]) => {
      it(`.versionCompare('${versionA}', '${versionB}') === ${expected}`, () => {
        expect(versionCompare(versionA as string, versionB as string)).to.be.eql(expected);
      });
    });
  });

  describe('.getConfigPath', () => {
    describe('use of SQLECTRON_HOME', () => {
      let env: NodeJS.ProcessEnv;

      before(() => {
        env = process.env;
        process.env = { SQLECTRON_HOME: '/path/to/env' };
      });

      it('should get config from process.env.SQLECTRON_HOME', () => {
        expect(getConfigPath()).to.be.eql(
          join(process.env.SQLECTRON_HOME as string, 'sqlectron.json'),
        );
      });

      after(() => {
        process.env = env;
      });
    });
  });
});
