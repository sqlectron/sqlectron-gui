import { services } from '../../browser/remote';


export const LOAD_SERVERS_REQUEST = 'LOAD_SERVERS_REQUEST';
export const LOAD_SERVERS_SUCCESS = 'LOAD_SERVERS_SUCCESS';
export const LOAD_SERVERS_FAILURE = 'LOAD_SERVERS_FAILURE';
export const SAVE_SERVER_REQUEST = 'SAVE_SERVER_REQUEST';
export const SAVE_SERVER_SUCCESS = 'SAVE_SERVER_SUCCESS';
export const SAVE_SERVER_FAILURE = 'SAVE_SERVER_FAILURE';
export const REMOVE_SERVER_REQUEST = 'REMOVE_SERVER_REQUEST';
export const REMOVE_SERVER_SUCCESS = 'REMOVE_SERVER_SUCCESS';
export const REMOVE_SERVER_FAILURE = 'REMOVE_SERVER_FAILURE';
export const FILTER_SERVERS = 'FILTER_SERVERS';


export function loadServers() {
  return async dispatch => {
    dispatch({ type: LOAD_SERVERS_REQUEST });
    try {
      const data = await services.servers.loadServerListFromFile();
      dispatch({
        type: LOAD_SERVERS_SUCCESS,
        servers: data.servers,
      });
    } catch (error) {
      dispatch({ type: LOAD_SERVERS_FAILURE, error });
    }
  };
}

export function saveServer ({ id, server }) {
  return async dispatch => {
    dispatch({ type: SAVE_SERVER_REQUEST, id, server });
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

export function removeServer ({ id }) {
  return async dispatch => {
    dispatch({ type: REMOVE_SERVER_REQUEST, id });
    try {
      await services.servers.removeServer(id);

      dispatch({
        type: REMOVE_SERVER_SUCCESS,
        id: id,
      });
    } catch (error) {
      dispatch({ type: REMOVE_SERVER_FAILURE, error });
    }
  };
}


export function filterServers(name) {
  return { type: FILTER_SERVERS, name };
}
