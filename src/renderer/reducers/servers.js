import {
  LOAD_SERVERS_SUCCESS,
  SAVE_SERVER_SUCCESS,
  SAVE_SERVER_FAILURE,
  REMOVE_SERVER_SUCCESS,
  REMOVE_SERVER_FAILURE,
  FILTER_SERVERS,
} from '../actions/types';


const INITIAL_STATE = {
  items: [],
};


export default function servers(state = INITIAL_STATE, action) {
  switch (action.type) {
  case LOAD_SERVERS_SUCCESS:
    return {
      ...state,
      items: loadAll(action.servers),
    };
  case FILTER_SERVERS:
    return {
      ...state,
      items: filter(state.items, action.name),
    };
  case SAVE_SERVER_SUCCESS:
    return {
      ...state,
      items: save(state.items, action.server, action.id),
      error: null,
    };
  case REMOVE_SERVER_SUCCESS:
    return {
      ...state,
      items: remove(state.items, action.id),
      error: null,
    };
  case SAVE_SERVER_FAILURE:
  case REMOVE_SERVER_FAILURE: {
    return {
      ...state,
      error: action.error.validationErrors,
    };
  }
  default:
    return state;
  }
}


function loadAll(items) {
  return items.map(item => {
    return { ...item, visible: true };
  });
}


function filter(items, name) {
  if (!name) { return loadAll(items); }

  const regex = RegExp(name, 'i');
  return items.map(db => {
    return {
      ...db,
      visible: regex.test(db.name),
    };
  });
}


function save(items, server, id) {
  const _items = ([...items] || []);
  const _server = { ...server, visible: true };
  if (id !== null) {
    _items[id] = _server;
  } else {
    _items.push(_server);
  }
  return _items;
}


function remove(items, id) {
  return [
    ...items.slice(0, id),
    ...items.slice(id + 1),
  ];
}
