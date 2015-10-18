import { services } from '../../browser/remote';


import {
  LOAD_SERVERS_REQUEST,
  LOAD_SERVERS_SUCCESS,
  LOAD_SERVERS_FAILURE,
  SAVE_SERVER_REQUEST,
  SAVE_SERVER_SUCCESS,
  SAVE_SERVER_FAILURE,
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

export function saveServer ({ id, server }) {
  return async dispatch => {
    dispatch({ type: SAVE_SERVER_REQUEST, server });
    try {
      const { addServer, updateServer } = services.servers;
      const data = await (id !== null ? updateServer(id, server) : addServer(server));

      dispatch({
        type: SAVE_SERVER_SUCCESS,
        id: id,
        server: data,
      });
    } catch (error) {
      dispatch({ type: SAVE_SERVER_FAILURE, error });
    }
  };
}
