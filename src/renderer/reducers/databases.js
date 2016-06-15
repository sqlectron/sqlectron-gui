import * as connTypes from '../actions/connections';
import * as queryTypes from '../actions/queries';
import * as types from '../actions/databases';


const INITIAL_STATE = {
  isFetching: false,
  didInvalidate: false,
  items: [],
  showingDiagram: false,
  diagramDatabase: null,
  fileName: null,
  diagramJSON: null,
  isSaving: false,
};


const COMMANDS_TRIGER_REFRESH = ['CREATE_DATABASE', 'DROP_DATABASE'];


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
  case connTypes.CONNECTION_REQUEST: {
    return action.isServerConnection
      ? { ...INITIAL_STATE, didInvalidate: true }
      : state;
  }
  case types.FETCH_DATABASES_REQUEST: {
    return { ...state, isFetching: true, didInvalidate: false, error: null };
  }
  case types.FETCH_DATABASES_SUCCESS: {
    return {
      ...state,
      isFetching: false,
      didInvalidate: false,
      items: action.databases.map(name => ({ name })),
      error: null,
    };
  }
  case types.FETCH_DATABASES_FAILURE: {
    return {
      ...state,
      isFetching: false,
      didInvalidate: true,
      error: action.error,
    };
  }
  case types.SHOW_DATABASE_DIAGRAM: {
    return {
      ...state,
      showingDiagram: true,
      diagramDatabase: action.name,
    };
  }
  case types.CLOSE_DATABASE_DIAGRAM: {
    return {
      ...state,
      showingDiagram: false,
      diagramDatabase: null,
      diagramJSON: null,
    };
  }
  case types.GENERATE_DATABASE_DIAGRAM: {
    return {
      ...state,
      fileName: null,
    };
  }
  case types.SAVE_DIAGRAM_REQUEST:
  case types.EXPORT_DIAGRAM_REQUEST: {
    return {
      ...state,
      isSaving: true,
    };
  }
  case types.SAVE_DIAGRAM_SUCCESS:
  case types.EXPORT_DIAGRAM_SUCCESS: {
    return {
      ...state,
      fileName: action.fileName,
      isSaving: false,
    };
  }
  case types.OPEN_DIAGRAM_SUCCESS: {
    return {
      ...state,
      fileName: action.fileName,
      diagramJSON: action.diagramJSON,
    };
  }
  case types.SAVE_DIAGRAM_FAILURE:
  case types.EXPORT_DIAGRAM_FAILURE:
  case types.OPEN_DIAGRAM_FAILURE: {
    return {
      ...state,
      error: action.error,
      isSaving: false,
    };
  }
  case queryTypes.EXECUTE_QUERY_SUCCESS: {
    return {
      ...state,
      didInvalidate: action.results
        .some(({ command }) => COMMANDS_TRIGER_REFRESH.includes(command)),
    };
  }
  default : return state;
  }
}
