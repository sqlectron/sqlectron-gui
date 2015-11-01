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


export function loadServers() {
  return async dispatch => {
    dispatch({ type: LOAD_SERVERS_REQUEST });
    try {
      const data = await services.servers.getAll();
      dispatch({
        type: LOAD_SERVERS_SUCCESS,
        servers: data.servers,
      });
    } catch (error) {
      dispatch({ type: LOAD_SERVERS_FAILURE, error });
    }
  };
}


export function saveServer ({ server, id }) {
  return async dispatch => {
    dispatch({ type: SAVE_SERVER_REQUEST, server });
    try {
      const data = await services.servers.addOrUpdate({ id, ...server });

      dispatch({
        type: SAVE_SERVER_SUCCESS,
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
      await services.servers.removeById(id);

      dispatch({
        type: REMOVE_SERVER_SUCCESS,
        id,
      });
    } catch (error) {
      dispatch({ type: REMOVE_SERVER_FAILURE, error });
    }
  };
}
