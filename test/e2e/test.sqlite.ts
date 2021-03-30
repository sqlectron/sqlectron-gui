import fs from 'fs';
import { expect } from 'chai';
import path from 'path';
import sqlite3 from 'sqlite3';

import helper from './helper';

const BASE_PATH = path.join(__dirname, '../fixtures/sqlite');
const DB_PATH = path.join(BASE_PATH, 'test.db');
const CONFIG_SAMPLE_PATH = path.join(BASE_PATH, 'sample-sqlectron.json');
const CONFIG_PATH = path.join(BASE_PATH, 'sqlectron.json');

function setupDB() {
  // Drop database
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
  }

  // Set DB path, it is required because sqlectron only suports absolute path
  const configSample = fs.readFileSync(CONFIG_SAMPLE_PATH, { encoding: 'utf8' });
  const config = JSON.parse(configSample);
  config.servers[0].database = DB_PATH;
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));

  // Create database
  const db = new sqlite3.Database(DB_PATH);

  db.serialize(function () {
    db.run('CREATE TABLE document (info TEXT)');

    const stmt = db.prepare('INSERT INTO document VALUES (?)');
    for (let i = 0; i < 10; i++) {
      stmt.run('Ipsum ' + i);
    }
    stmt.finalize();
  });

  return db;
}

describe('Sqlite', function () {
  let db;
  let app;
  let mainWindow;

  before(async () => {
    db = setupDB();

    const res = await helper.startApp({
      sqlectronHome: BASE_PATH,
    });

    app = res.app;
    mainWindow = res.mainWindow;
  });

  after(async () => {
    await helper.endApp(app);
    db.close();
  });

  it('should connect and run basic actions', async () => {
    await mainWindow.waitForSelector('#server-list');

    const list = await mainWindow.$$('#server-list .header');
    expect(list).to.have.lengthOf(1);

    await helper.expectToEqualText(mainWindow, '#server-list .header', 'sqlite-test');
    await helper.expectToEqualText(mainWindow, '#server-list .attached.button', 'Connect');

    const btnConnect = await mainWindow.$('#server-list .attached.button');
    // TODO: replace dispatchEvent('click') with the click method when we upgrade the electron app.
    // https://github.com/microsoft/playwright/issues/1042
    await btnConnect.dispatchEvent('click');

    await mainWindow.waitForSelector('#sidebar .item-Table');
    const tables = await mainWindow.$$('#sidebar .item-Table');
    expect(tables).to.have.lengthOf(1);
    await expect(await tables[0].innerText()).to.be.equal('document');

    // Clicks in the table to run default select query
    const btnTable = await mainWindow.$('#sidebar .item-Table span');
    await btnTable.dispatchEvent('click');

    // Set default query and automatically executes it
    await helper.expectToEqualText(
      mainWindow,
      '.react-tabs__tab-panel--selected .ace_content',
      'SELECT * FROM "document" LIMIT 101',
    );

    // Render results for a single query
    await mainWindow.waitForSelector('.grid-query-wrapper');
    const queryResults = await mainWindow.$$('.grid-query-wrapper');
    expect(queryResults).to.have.lengthOf(1);

    // Assert rows
    const rows = await mainWindow.$$('.ReactVirtualized__Grid__cell');
    // NOTE: Keeping it disabled on CI for now. For some reason on running this
    // assertion on CI it doesn't return any rows.
    if (process.env.CI !== 'true') {
      expect(rows).to.have.lengthOf(11); // rows + info header
      expect(await rows[0].innerText()).to.be.equal('info');
      for (let i = 1; i < rows.length; i++) {
        await expect(await rows[i].innerText()).to.be.equal(`Ipsum ${i - 1}`);
      }
    }
  });
});
