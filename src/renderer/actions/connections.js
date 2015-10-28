import { services } from '../../browser/remote';


export const CONNECTION_REQUEST = 'CONNECTION_REQUEST';
export const CONNECTION_SUCCESS = 'CONNECTION_SUCCESS';
export const CONNECTION_FAILURE = 'CONNECTION_FAILURE';


export function connect (serverId, database) {
  return async (dispatch, getState) => {
    const { servers } = getState();
    const id = parseInt(serverId, 10);
    const server = {
      ...servers.items[id],
      id,
    };

    dispatch({ type: CONNECTION_REQUEST, server, database });
    try {
      await services.db.connect(server, database);
      dispatch({ type: CONNECTION_SUCCESS, server, database });
    } catch (error) {
      dispatch({ type: CONNECTION_FAILURE, server, database, error });
    }
  };
}
