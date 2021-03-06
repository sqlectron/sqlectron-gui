import { Server } from './server';

export interface Config {
  log: {
    console: boolean;
    file: boolean;
    level: string;
    path: string;
  };
  zoomFactor: number;
  limitQueryDefaultSelectTop: number;
  servers: Array<Server>;
  enabledAutoComplete: boolean;
  enabledLiveAutoComplete: boolean;
  // queries: Object;
  enabledDarkTheme: boolean;
  disabledOpenAnimation: boolean;
  csvDelimiter: string;
  connectionsAsList: boolean;
  customFont: string;
  // Fields attached from package.json
  name: string;
  version: string;
  homepage?: string;
  bugs?: string;
  repository?: {
    url: string;
  };
  // Fields attached from cli args
  devMode?: boolean;
  printVersion?: boolean;
  // Fields attached in runtime by the config setup
  crypto?: {
    secret: string;
  };
}
