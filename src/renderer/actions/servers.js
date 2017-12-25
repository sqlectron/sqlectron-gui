import { sqlectron } from '../../browser/remote';
import * as ConfigActions from './config.js';


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


export function startEditing(id) {
  return (dispatch, getState) => {
    if (!id) {
      dispatch({ type: START_EDITING_SERVER });
      return;
    }

    const { config } = getState();
    const cryptoSecret = config.data.crypto.secret;

    const server = config.data.servers.find(srv => srv.id === id);
    if (!server) {
      return;
    }

    const decryptedServer = sqlectron.servers.decryptSecrects(server, cryptoSecret);

    dispatch({ type: START_EDITING_SERVER, server: decryptedServer });
  };
}


export function finishEditing() {
  return { type: FINISH_EDITING_SERVER };
}


export function saveServer ({ server, id }) {
  return async (dispatch, getState) => {
    dispatch({ type: SAVE_SERVER_REQUEST, server });
    try {
      const { config } = getState();
      const cryptoSecret = config.data.crypto.secret;

      const data = await sqlectron.servers.addOrUpdate({ id, ...server }, cryptoSecret);

      dispatch({
        type: SAVE_SERVER_SUCCESS,
        server: convertToPlainObject(data),
      });

      dispatch(ConfigActions.loadConfig());
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
  return async (dispatch, getState) => {
    dispatch({ type: DUPLICATE_SERVER_REQUEST, server });
    try {
      const newName = await getUniqueName(server);
      const duplicated = { ...server, name: newName };
      delete duplicated.id;

      const { config } = getState();
      const cryptoSecret = config.data.crypto.secret;

      const data = await sqlectron.servers.addOrUpdate(duplicated, cryptoSecret);

      dispatch({
        type: DUPLICATE_SERVER_SUCCESS,
        server: convertToPlainObject(data),
      });

      dispatch(ConfigActions.loadConfig());
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
