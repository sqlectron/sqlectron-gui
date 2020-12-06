export function mapObjectToConfig(obj) {
  const config = {
    zoomFactor: parseFloat(obj.zoomFactor) || 1,
    limitQueryDefaultSelectTop: parseInt(obj.limitQueryDefaultSelectTop, 10) || 100,
    enabledAutoComplete: obj.enabledAutoComplete || false,
    enabledLiveAutoComplete: obj.enabledLiveAutoComplete || false,
    enabledDarkTheme: obj.enabledDarkTheme || false,
    disabledOpenAnimation: obj.disabledOpenAnimation || false,
    csvDelimiter: obj.csvDelimiter || ',',
    connectionsAsList: obj.connectionsAsList || false,
    customFont: obj.customFont || 'Lato',
  };
  if (!obj.log) { return config; }

  const { log } = obj;
  config.log = {
    console: log.console,
    file: log.file,
    level: log.level,
    path: log.path,
  };

  return config;
}
