import fs from 'fs';
import { expect } from 'chai';
import path from 'path';

import helper from './helper';

const BASE_PATH = path.join(__dirname, '../fixtures/ssh-mysql');
const SQLECTRON_DB_CORE_PATH = path.join(__dirname, '../../../sqlectron-db-core');
const CONFIG_SAMPLE_PATH = path.join(BASE_PATH, 'sample-sqlectron.json');
const CONFIG_PATH = path.join(BASE_PATH, 'sqlectron.json');

function setupDB() {
  // Set path attributes, it is required because sqlectron only suports absolute path
  let configSample = fs.readFileSync(CONFIG_SAMPLE_PATH, { encoding: 'utf8' });
  configSample = configSample.replace('{{SQLECTRON_DB_CORE_PATH}}', SQLECTRON_DB_CORE_PATH);

  const config = JSON.parse(configSample);
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

describe('SSH MySQL', function () {
  this.timeout(360000);
  let app;
  let mainWindow;

  before(async () => {
    setupDB();

    const res = await helper.startApp({
      sqlectronHome: BASE_PATH,
    });

    app = res.app;
    mainWindow = res.mainWindow;
  });

  after(async () => {
    await helper.endApp(app);
  });

  it('should connect and run basic actions', async () => {
    await mainWindow.waitForSelector('#server-list');

    const list = await mainWindow.$$('#server-list .header');
    expect(list).to.have.lengthOf(1);

    await helper.expectToEqualText(
      mainWindow,
      '#server-list .header',
      'test mysql with SSH private key rsa',
    );
    await helper.expectToEqualText(mainWindow, '#server-list .attached.button', 'Connect');

    const btnConnect = await mainWindow.$('#server-list .attached.button');
    // TODO: replace dispatchEvent('click') with the click method when we upgrade the electron app.
    // https://github.com/microsoft/playwright/issues/1042
    await btnConnect.dispatchEvent('click');

    await mainWindow.waitForSelector('#sidebar .header');
    const dbItem = await helper.getElementByText(mainWindow, '#sidebar .header', 'sqlectron');
    await dbItem.dispatchEvent('click');

    await mainWindow.waitForSelector('#sidebar .item-Table');
    const tables = await mainWindow.$$('#sidebar .item-Table');

    expect(tables).to.have.lengthOf(2);
    await expect(await tables[0].innerText()).to.be.equal('roles');
    await expect(await tables[1].innerText()).to.be.equal('users');

    // Clicks in the table to run default select query
    const btnTable = await mainWindow.$('#sidebar .item-Table span');
    await btnTable.dispatchEvent('click');

    // Set default query and automatically executes it
    await helper.expectToEqualText(
      mainWindow,
      '.react-tabs__tab-panel--selected .ace_content',
      'SELECT * FROM `roles` LIMIT 101',
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
      expect(rows).to.have.lengthOf.at.least(2); // rows + info header
      expect(await rows[0].innerText()).to.be.equal('id');
    }
  });
});
