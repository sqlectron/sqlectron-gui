import { loadServerListFromFile } from '../services/servers';


import {
  LOAD_CONNECTIONS_REQUEST,
  LOAD_CONNECTIONS_SUCCESS,
  LOAD_CONNECTIONS_FAILURE
} from './types';


export function loadConnections() {
  return async dispatch => {
    dispatch({ type: LOAD_CONNECTIONS_REQUEST });
    try {
      const data = await loadServerListFromFile();
      dispatch({
        type: LOAD_CONNECTIONS_SUCCESS,
        connections: data.servers
      });
    } catch (error) {
      dispatch({ type: LOAD_CONNECTIONS_FAILURE, error });
    }
  };
}
