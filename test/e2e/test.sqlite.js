const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const helper = require('./helper');

function setupDB() {
  const DB_PATH = path.join(__dirname, '../fixtures/sqlite/test.db');

  // Drop database
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
  }

  // Create database
  var db = new sqlite3.Database(DB_PATH);

  db.serialize(function () {
    db.run('CREATE TABLE lorem (info TEXT)');

    var stmt = db.prepare('INSERT INTO lorem VALUES (?)');
    for (var i = 0; i < 10; i++) {
      stmt.run('Ipsum ' + i);
    }
    stmt.finalize();
  });

  return db;
}

describe('Sqlite', function () {
  beforeAll(async () => {
    const { app, mainWindow } = await helper.startApp({
      sqlectronHome: path.join(__dirname, '../fixtures/sqlite'),
    });

    this.app = app;
    this.mainWindow = mainWindow;
    this.db = setupDB();
  });

  afterAll(async () => {
    await helper.endApp(this.app);
    this.db.close();
  });

  test('Connect DB', async () => {
    await expect(this.mainWindow).toEqualText('#server-list .header', 'sqlite-test');
    // await expect(this.mainWindow).not.toHaveSelector('#server-list .meta');
    await expect(this.mainWindow).toEqualText('#server-list .attached.button', 'Connect');

    // TODO: It requires latest version of Chrome to work.
    // Which means it will only work once Electron has been upgraded.
    // https://github.com/microsoft/playwright/issues/1042
    // await this.mainWindow.click('#server-list .attached.button', {});
  });
});
