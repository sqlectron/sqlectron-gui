import * as types from '../actions/servers';


const INITIAL_STATE = {
  isSaving: false,
  isEditing: false,
  items: [],
  error: null,
  editingId: null,
};


export default function servers(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.LOAD_SERVERS_SUCCESS:
      return {
        ...state,
        items: action.servers,
      };
    case types.START_EDITING_SERVER: {
      return {
        ...state,
        isSaving: false,
        isEditing: true,
        editingId: action.id || null,
      };
    }
    case types.FINISH_EDITING_SERVER: {
      return {
        ...state,
        isSaving: false,
        isEditing: false,
        editingId: null,
        error: null,
      };
    }
    case types.SAVE_SERVER_REQUEST:
    case types.DUPLICATE_SERVER_REQUEST:
    case types.REMOVE_SERVER_REQUEST: {
      return {
        ...state,
        isSaving: true,
      };
    }
    case types.SAVE_SERVER_SUCCESS:
    case types.DUPLICATE_SERVER_SUCCESS: {
      return {
        ...state,
        items: save(state.items, action.server),
        error: null,
        isSaving: false,
        isEditing: false,
      };
    }
    case types.REMOVE_SERVER_SUCCESS:
      return {
        ...state,
        items: remove(state.items, action.id),
        error: null,
        isSaving: false,
        isEditing: false,
      };
    case types.SAVE_SERVER_FAILURE:
    case types.DUPLICATE_SERVER_FAILURE:
    case types.REMOVE_SERVER_FAILURE: {
      return {
        ...state,
        error: action.error.validationErrors,
        isSaving: false,
      };
    }
    default:
      return state;
  }
}


function save(dataItems, server) {
  const items = ([...dataItems] || []);
  const index = server.id && items.findIndex(srv => srv.id === server.id);
  if (index >= 0) {
    items[index] = server;
  } else {
    items.push(server);
  }
  return items;
}


function remove(items, id) {
  const index = items.findIndex(srv => srv.id === id);
  return [
    ...items.slice(0, index),
    ...items.slice(index + 1),
  ];
}
