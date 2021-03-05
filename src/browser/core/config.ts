import { v4 as uuidv4 } from 'uuid';
import * as utils from './utils';
import * as crypto from './crypto';
import { Config } from '../../common/types/config';

const EMPTY_CONFIG = <Config>{};

function sanitizeServer(server, cryptoSecret) {
  const srv = { ...server };

  // ensure has an unique id
  if (!srv.id) {
    srv.id = uuidv4();
  }

  // ensure has the new fileld SSL
  srv.ssl = srv.ssl || false;

  // ensure all secret fields are encrypted
  if (typeof srv.encrypted === 'undefined') {
    srv.encrypted = true;

    if (srv.password) {
      srv.password = crypto.encrypt(srv.password, cryptoSecret);
    }

    if (srv.ssh && srv.ssh.password) {
      srv.ssh.password = crypto.encrypt(srv.ssh.password, cryptoSecret);
    }
  } else if (srv.encrypted) {
    if (srv.password && typeof srv.password === 'string') {
      srv.password = crypto.encrypt(crypto.unsafeDecrypt(srv.password, cryptoSecret), cryptoSecret);
    }
    if (srv.ssh && srv.ssh.password && typeof srv.ssh.password === 'string') {
      srv.ssh.password = crypto.encrypt(
        crypto.unsafeDecrypt(srv.ssh.password, cryptoSecret),
        cryptoSecret,
      );
    }
  }

  return srv;
}

function sanitizeServers(data, cryptoSecret) {
  return data.servers.map((server) => sanitizeServer(server, cryptoSecret));
}

/**
 * Prepare the configuration file sanitizing and validating all fields availbale
 */
export async function prepare(cryptoSecret: string): Promise<void> {
  const filename = utils.getConfigPath();
  const fileExistsResult = await utils.fileExists(filename);
  if (!fileExistsResult) {
    await utils.createParentDirectory(filename);
    await utils.writeJSONFile(filename, EMPTY_CONFIG);
  }

  const result = await utils.readJSONFile(filename);

  result.servers = sanitizeServers(result, cryptoSecret);

  await utils.writeJSONFile(filename, result);

  // TODO: Validate whole configuration file
  // if (!configValidate(result)) {
  //   throw new Error('Invalid ~/.sqlectron.json file format');
  // }
}

export function prepareSync(cryptoSecret: string): void {
  const filename = utils.getConfigPath();
  const fileExistsResult = utils.fileExistsSync(filename);
  if (!fileExistsResult) {
    utils.createParentDirectorySync(filename);
    utils.writeJSONFileSync(filename, EMPTY_CONFIG);
  }

  const result = utils.readJSONFileSync(filename);

  result.servers = sanitizeServers(result, cryptoSecret);

  utils.writeJSONFileSync(filename, result);

  // TODO: Validate whole configuration file
  // if (!configValidate(result)) {
  //   throw new Error('Invalid ~/.sqlectron.json file format');
  // }
}

export function path(): string {
  const filename = utils.getConfigPath();
  return utils.resolveHomePathToAbsolute(filename);
}

export function get(): Promise<Config> {
  const filename = utils.getConfigPath();
  return utils.readJSONFile(filename);
}

export function getSync(): Config {
  const filename = utils.getConfigPath();
  return utils.readJSONFileSync(filename);
}

export function save(data: Config): Promise<void> {
  const filename = utils.getConfigPath();
  return utils.writeJSONFile(filename, data);
}

export async function saveSettings(data: Config): Promise<void> {
  const fullData = await get();
  const filename = utils.getConfigPath();
  const newData = { ...fullData, ...data };
  return utils.writeJSONFile(filename, newData);
}
