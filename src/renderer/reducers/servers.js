import * as types from '../actions/servers';


const INITIAL_STATE = {
  items: [],
};


export default function servers(state = INITIAL_STATE, action) {
  switch (action.type) {
  case types.LOAD_SERVERS_SUCCESS:
    return {
      ...state,
      items: action.servers,
    };
  case types.SAVE_SERVER_SUCCESS:
    return {
      ...state,
      items: save(state.items, action.server, action.name),
      error: null,
    };
  case types.REMOVE_SERVER_SUCCESS:
    return {
      ...state,
      items: remove(state.items, action.name),
      error: null,
    };
  case types.SAVE_SERVER_FAILURE:
  case types.REMOVE_SERVER_FAILURE: {
    return {
      ...state,
      error: action.error.validationErrors,
    };
  }
  default:
    return state;
  }
}


function save(items, server, name) {
  const _items = ([...items] || []);
  const _server = { ...server, visible: true };
  if (name) {
    const index = _items.findIndex(srv => srv.name === name);
    _items[index] = _server;
  } else {
    _items.push(_server);
  }
  return _items;
}


function remove(items, name) {
  const index = items.findIndex(srv => srv.name === name);
  return [
    ...items.slice(0, index),
    ...items.slice(index + 1),
  ];
}
