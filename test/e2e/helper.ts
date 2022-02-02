import path from 'path';
import { expect } from 'chai';
import { _electron as electron, ElementHandle } from 'playwright';
import type { ElectronApplication, Page } from 'playwright';

const startApp = async ({
  sqlectronHome,
}: {
  sqlectronHome: string;
}): Promise<{ app: ElectronApplication; mainWindow: Page }> => {
  // Start Electron application
  const app: ElectronApplication = await electron.launch({
    args:
      process.env.DEV_MODE === 'true'
        ? [path.join(__dirname, '../../src/browser/main'), '--dev']
        : [path.join(__dirname, '../../out/browser/main')],
    // MUST pass along the host env variables, otherwise it will
    // crash if we use a custom env variable with tests running with xvfb
    env: {
      ...process.env,
      SQLECTRON_HOME: sqlectronHome,
    },
  });

  const mainWindow = await getAppPage(app);

  return { app, mainWindow };
};

const endApp = async (app: ElectronApplication): Promise<void> => {
  // After each test close Electron application.
  await app.close();
};

const wait = (time: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, time));

const getAppPage = async (app: ElectronApplication, { waitAppLoad = true } = {}): Promise<Page> => {
  // Attempt though 25 times waiting 1s between each attempt
  // to get the application page
  for (let attempt = 0; attempt < 25; attempt++) {
    const windows = app.windows();

    for (let i = 0; i < windows.length; i++) {
      const page = windows[i];
      if ((await page.title()) === 'Sqlectron') {
        if (waitAppLoad) {
          // Wait until the app finished loading
          await page.waitForSelector('.ui');
        }

        return page;
      }
    }

    await wait(1000);
  }

  throw new Error('Could not find application page');
};

const expectToEqualText = async (page: Page, selector: string, text: string): Promise<void> => {
  expect(await page.$eval(selector, (node: HTMLElement) => node.innerText)).to.be.equal(text);
};

const getElementByText = async (
  page: Page,
  selector: string,
  text: string,
): Promise<ElementHandle<HTMLElement>> => {
  const elements = await page.$$(selector);
  expect(elements).to.have.lengthOf.at.least(1);

  for (const element of elements) {
    const eltext = await element.innerText();
    if (eltext === text) {
      return element as ElementHandle<HTMLElement>;
    }
  }

  throw new Error(`Not found element with text "${text}" for selector "${selector}"`);
};

export default {
  startApp,
  endApp,
  wait,
  getAppPage,
  expectToEqualText,
  getElementByText,
};
