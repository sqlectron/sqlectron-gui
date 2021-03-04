import { expect } from 'chai';
import { db } from '../../src/browser/core';

describe('sqlectron-db-core exports', () => {
  it('should export ADAPTERS and CLIENTS', () => {
    expect(db.CLIENTS).to.eql(db.ADAPTERS);
  });

  it('should export db object', () => {
    expect(db).to.be.a('object');
  });
});
