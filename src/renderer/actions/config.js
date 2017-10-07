import cloneDeep from 'lodash.clonedeep';
import { config, sqlectron } from '../../browser/remote';


export const LOAD_CONFIG_REQUEST = 'LOAD_CONFIG_REQUEST';
export const LOAD_CONFIG_SUCCESS = 'LOAD_CONFIG_SUCCESS';
export const LOAD_CONFIG_FAILURE = 'LOAD_CONFIG_FAILURE';
export const SAVE_CONFIG_REQUEST = 'SAVE_CONFIG_REQUEST';
export const SAVE_CONFIG_SUCCESS = 'SAVE_CONFIG_SUCCESS';
export const SAVE_CONFIG_FAILURE = 'SAVE_CONFIG_FAILURE';


export function loadConfig() {
  return async dispatch => {
    dispatch({ type: LOAD_CONFIG_REQUEST });
    try {
      const forceCleanCache = true;
      const remoteConfig = await config.get(forceCleanCache);

      // Remove any "reference" to the remote IPC object
      const configData = cloneDeep(remoteConfig);

      dispatch({ type: LOAD_CONFIG_SUCCESS, config: configData });
    } catch (error) {
      dispatch({ type: LOAD_CONFIG_FAILURE, error });
    }
  };
}


export function saveConfig(configData) {
  return async dispatch => {
    dispatch({ type: SAVE_CONFIG_REQUEST });
    try {
      await sqlectron.config.saveSettings(configData);
      dispatch({ type: SAVE_CONFIG_SUCCESS, config: configData });
    } catch (error) {
      dispatch({ type: SAVE_CONFIG_FAILURE, error });
    }
  };
}
