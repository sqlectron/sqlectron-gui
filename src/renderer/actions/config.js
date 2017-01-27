import cloneDeep from 'lodash.clonedeep';
import { sqlectron } from '../../browser/remote';


export const LOAD_CONFIG_REQUEST = 'LOAD_CONFIG_REQUEST';
export const LOAD_CONFIG_SUCCESS = 'LOAD_CONFIG_SUCCESS';
export const LOAD_CONFIG_FAILURE = 'LOAD_CONFIG_FAILURE';


export function loadConfig() {
  return async dispatch => {
    dispatch({ type: LOAD_CONFIG_REQUEST });
    try {
      await sqlectron.config.prepare();

      const remoteConfig = await sqlectron.config.get();

      // Remove any "reference" to the remote IPC object
      const config = cloneDeep(remoteConfig);

      dispatch({ type: LOAD_CONFIG_SUCCESS, config });
    } catch (error) {
      dispatch({ type: LOAD_CONFIG_FAILURE, error });
    }
  };
}
