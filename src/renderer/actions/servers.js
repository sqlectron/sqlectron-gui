import { sqlectron } from '../../browser/remote';


export const LOAD_SERVERS_REQUEST = 'LOAD_SERVERS_REQUEST';
export const LOAD_SERVERS_SUCCESS = 'LOAD_SERVERS_SUCCESS';
export const LOAD_SERVERS_FAILURE = 'LOAD_SERVERS_FAILURE';
export const SAVE_SERVER_REQUEST = 'SAVE_SERVER_REQUEST';
export const SAVE_SERVER_SUCCESS = 'SAVE_SERVER_SUCCESS';
export const SAVE_SERVER_FAILURE = 'SAVE_SERVER_FAILURE';
export const REMOVE_SERVER_REQUEST = 'REMOVE_SERVER_REQUEST';
export const REMOVE_SERVER_SUCCESS = 'REMOVE_SERVER_SUCCESS';
export const REMOVE_SERVER_FAILURE = 'REMOVE_SERVER_FAILURE';
export const DUPLICATE_SERVER_REQUEST = 'DUPLICATE_SERVER_REQUEST';
export const DUPLICATE_SERVER_SUCCESS = 'DUPLICATE_SERVER_SUCCESS';
export const DUPLICATE_SERVER_FAILURE = 'DUPLICATE_SERVER_FAILURE';
export const START_EDITING_SERVER = 'START_EDITING_SERVER';
export const FINISH_EDITING_SERVER = 'FINISH_EDITING_SERVER';


export function loadServers() {
  return async dispatch => {
    dispatch({ type: LOAD_SERVERS_REQUEST });
    try {
      await sqlectron.config.prepare();
      const dataServers = await sqlectron.servers.getAll();
      dispatch({
        type: LOAD_SERVERS_SUCCESS,
        servers: dataServers.map(convertToPlainObject),
      });
    } catch (error) {
      dispatch({ type: LOAD_SERVERS_FAILURE, error });
    }
  };
}


export function startEditing(id) {
  return { type: START_EDITING_SERVER, id };
}


export function finisEditing() {
  return { type: FINISH_EDITING_SERVER };
}


export function saveServer ({ server, id }) {
  return async dispatch => {
    dispatch({ type: SAVE_SERVER_REQUEST, server });
    try {
      const data = await sqlectron.servers.addOrUpdate({ id, ...server });

      dispatch({
        type: SAVE_SERVER_SUCCESS,
        server: convertToPlainObject(data),
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
      await sqlectron.servers.removeById(id);

      dispatch({
        type: REMOVE_SERVER_SUCCESS,
        id,
      });
    } catch (error) {
      dispatch({ type: REMOVE_SERVER_FAILURE, error });
    }
  };
}


export function duplicateServer ({ server }) {
  return async dispatch => {
    dispatch({ type: DUPLICATE_SERVER_REQUEST, server });
    try {
      const newName = await getUniqueName(server);
      const duplicated = { ...server, name: newName };
      delete duplicated.id;

      const data = await sqlectron.servers.addOrUpdate(duplicated);

      dispatch({
        type: DUPLICATE_SERVER_SUCCESS,
        server: convertToPlainObject(data),
      });
    } catch (error) {
      dispatch({ type: DUPLICATE_SERVER_FAILURE, error });
    }
  };
}


async function getUniqueName(server) {
  const dataServers = await sqlectron.servers.getAll();
  const duplicatedName = (name) => dataServers.some(srv => srv.name === name);
  let currentName = server.name;
  let num = 0;
  while (duplicatedName(currentName)) {
    num += 1;
    currentName = `${server.name}-${num}`;
  }
  return currentName;
}


/**
 * Force the object has the values instead of getter and setter properties.
 * This is necessary because seems there is some bug around React accessing
 * getter properties from objects comming from Electron remote API.
 */
function convertToPlainObject(item) {
  return JSON.parse(JSON.stringify(item));
}
