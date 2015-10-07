import { services } from '../../browser/remote';


import {
  LOAD_SERVERS_REQUEST,
  LOAD_SERVERS_SUCCESS,
  LOAD_SERVERS_FAILURE
} from './types';


export function loadServers() {
  return async dispatch => {
    dispatch({ type: LOAD_SERVERS_REQUEST });
    try {
      const data = await services.servers.loadServerListFromFile();
      dispatch({
        type: LOAD_SERVERS_SUCCESS,
        servers: data.servers
      });
    } catch (error) {
      dispatch({ type: LOAD_SERVERS_FAILURE, error });
    }
  };
}
