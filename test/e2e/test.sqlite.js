const fs = require('fs');
const { expect } = require('chai');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const helper = require('./helper');

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
  var db = new sqlite3.Database(DB_PATH);

  db.serialize(function () {
    db.run('CREATE TABLE document (info TEXT)');

    var stmt = db.prepare('INSERT INTO document VALUES (?)');
    for (var i = 0; i < 10; i++) {
      stmt.run('Ipsum ' + i);
    }
    stmt.finalize();
  });

  return db;
}

describe('Sqlite', function () {
  this.timeout(360000);

  before(async () => {
    this.db = setupDB();

    const { app, mainWindow } = await helper.startApp({
      sqlectronHome: path.join(__dirname, '../fixtures/sqlite'),
    });

    this.app = app;
    this.mainWindow = mainWindow;
  });

  after(async () => {
    await helper.endApp(this.app);
    this.db.close();
  });

  it('should connect and run basic actions', async () => {
    await this.mainWindow.waitForSelector('#server-list');

    const list = await this.mainWindow.$$('#server-list .header');
    expect(list).to.have.lengthOf(1);

    await helper.expectToEqualText(this.mainWindow, '#server-list .header', 'sqlite-test');
    await helper.expectToEqualText(this.mainWindow, '#server-list .attached.button', 'Connect');

    const btnConnect = await this.mainWindow.$('#server-list .attached.button');
    // TODO: replace dispatchEvent('click') with the click method when we upgrade the electron app.
    // https://github.com/microsoft/playwright/issues/1042
    await btnConnect.dispatchEvent('click');

    await this.mainWindow.waitForSelector('#sidebar .itemTable');
    const tables = await this.mainWindow.$$('#sidebar .itemTable');
    expect(tables).to.have.lengthOf(1);
    await expect(await tables[0].innerText()).to.be.equal('document');

    // Clicks in the table to run default select query
    const btnTable = await this.mainWindow.$('#sidebar .itemTable span');
    await btnTable.dispatchEvent('click');

    // Set default query and automatically executes it
    await helper.expectToEqualText(
      this.mainWindow,
      '.ace_content',
      'SELECT * FROM "document" LIMIT 101'
    );

    // Render results for a single query
    await this.mainWindow.waitForSelector('.grid-query-wrapper');
    const queryResults = await this.mainWindow.$$('.grid-query-wrapper');
    expect(queryResults).to.have.lengthOf(1);

    // Assert rows
    const rows = await this.mainWindow.$$('.ReactVirtualized__Grid__cell');
    expect(rows).to.have.lengthOf(11); // rows + info header
    for (let i = 0; i < rows.length; i++) {
      await expect(await rows[i].innerText()).to.be.equal(i === 0 ? 'info' : `Ipsum ${i - 1}`);
    }
  });
});
