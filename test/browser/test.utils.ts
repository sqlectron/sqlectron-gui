import { expect } from 'chai';
import { join } from 'path';
import { getConfigPath } from '../../src/browser/core/utils';

describe('utils', () => {
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
