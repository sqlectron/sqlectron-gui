import { AnyAction } from 'redux';
import cloneDeep from 'lodash.clonedeep';
import { ThunkResult } from '../reducers';
import { config, sqlectron } from '../../browser/remote';
import { Config } from '../../common/types/config';

export const LOAD_CONFIG_REQUEST = 'LOAD_CONFIG_REQUEST';
export const LOAD_CONFIG_SUCCESS = 'LOAD_CONFIG_SUCCESS';
export const LOAD_CONFIG_FAILURE = 'LOAD_CONFIG_FAILURE';
export const SAVE_CONFIG_REQUEST = 'SAVE_CONFIG_REQUEST';
export const SAVE_CONFIG_SUCCESS = 'SAVE_CONFIG_SUCCESS';
export const SAVE_CONFIG_FAILURE = 'SAVE_CONFIG_FAILURE';
export const START_EDITING_CONFIG = 'START_EDITING_CONFIG';
export const FINISH_EDITING_CONFIG = 'FINISH_EDITING_CONFIG';

export function loadConfig(): ThunkResult<void> {
  return async (dispatch) => {
    dispatch({ type: LOAD_CONFIG_REQUEST });
    try {
      const forceCleanCache = true;
      const configPath = await sqlectron.config.path();
      const remoteConfig = await config.getConfig(forceCleanCache);

      // Remove any "reference" to the remote IPC object
      const configData = cloneDeep(remoteConfig);

      dispatch({ type: LOAD_CONFIG_SUCCESS, config: configData, path: configPath });
    } catch (error) {
      dispatch({ type: LOAD_CONFIG_FAILURE, error });
    }
  };
}

export function saveConfig(configData: Config): ThunkResult<void> {
  return async (dispatch) => {
    dispatch({ type: SAVE_CONFIG_REQUEST });
    try {
      await sqlectron.config.saveSettings(configData);
      await sqlectron.setSelectLimit();
      dispatch({ type: SAVE_CONFIG_SUCCESS, config: configData });
    } catch (error) {
      dispatch({ type: SAVE_CONFIG_FAILURE, error });
    }
  };
}

export function startEditing(id: string): AnyAction {
  return { type: START_EDITING_CONFIG, id };
}

export function finishEditing(): AnyAction {
  return { type: FINISH_EDITING_CONFIG };
}
