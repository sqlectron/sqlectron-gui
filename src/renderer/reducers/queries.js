import * as connTypes from '../actions/connections';
import * as types from '../actions/queries';


const INITIAL_STATE = {
  lastCreatedId: 0,
  currentQueryId: null,
  queryIds: [],
  queriesById: {},
  resultItemsPerPage: 100,
  enabledAutoComplete: true,
  enabledLiveAutoComplete: true,
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case connTypes.CLOSE_CONNECTION: {
      return INITIAL_STATE;
    }
    case connTypes.CONNECTION_SUCCESS:
    case types.NEW_QUERY: {
      return addNewQuery(state, action);
    }
    case types.SELECT_QUERY: {
      return {
        ...state,
        currentQueryId: action.id,
      };
    }
    case types.REMOVE_QUERY: {
      const newState = { ...state };

      const database = state.queriesById[state.currentQueryId].database;
      const index = state.queryIds.indexOf(state.currentQueryId);

      if (state.length === 1) {
        newState.currentQueryId = null;
      } else if (index > 0) {
        newState.currentQueryId = state.queryIds[index - 1];
      } else {
        newState.currentQueryId = state.queryIds[index + 1];
      }

      newState.queryIds.splice(index, 1);
      delete newState.queriesById[state.currentQueryId];

      if (newState.queryIds.length >= 1) {
        return newState;
      }

      return addNewQuery(newState, { ...action, database });
    }
    case types.EXECUTE_QUERY_REQUEST: {
      return changeStateByCurrentQuery(state, {
        copied: false,
        isExecuting: true,
        isDefaultSelect: action.isDefaultSelect,
        didInvalidate: false,
        queryHistory: [
          ...state.queriesById[state.currentQueryId].queryHistory,
          action.query,
        ],
      });
    }
    case types.EXECUTE_QUERY_SUCCESS: {
      return changeStateByCurrentQuery(state, {
        error: null,
        isExecuting: false,
        results: action.results,
      });
    }
    case types.EXECUTE_QUERY_FAILURE: {
      return changeStateByCurrentQuery(state, {
        results: null,
        isExecuting: false,
        error: action.error,
      });
    }
    case types.CANCEL_QUERY_REQUEST: {
      return changeStateByCurrentQuery(state, {
        isCanceling: true,
      });
    }
    case types.CANCEL_QUERY_SUCCESS: {
      return changeStateByCurrentQuery(state, {
        error: null,
        isCanceling: false,
      });
    }
    case types.CANCEL_QUERY_FAILURE: {
      return changeStateByCurrentQuery(state, {
        results: null,
        isExecuting: false,
        isCanceling: false,
        error: action.error,
      });
    }
    case types.UPDATE_QUERY: {
      return changeStateByCurrentQuery(state, {
        query: action.query,
        selectedQuery: action.selectedQuery,
        copied: false,
      }, { table: action.table });
    }
    case types.COPY_QUERY_RESULT_TO_CLIPBOARD_REQUEST: {
      return changeStateByCurrentQuery(state, {
        error: null,
        copied: false,
      });
    }
    case types.COPY_QUERY_RESULT_TO_CLIPBOARD_SUCCESS: {
      return changeStateByCurrentQuery(state, {
        copied: true,
      });
    }
    case types.COPY_QUERY_RESULT_TO_CLIPBOARD_FAIL: {
      return changeStateByCurrentQuery(state, {
        error: action.error,
        copied: false,
      });
    }
    case types.RENAME_QUERY: {
      if (!action.name.length) {
        return state;
      }

      return changeStateByCurrentQuery(state, {
        name: action.name,
      });
    }
    case types.SAVE_QUERY_SUCCESS: {
      return changeStateByCurrentQuery(state, {
        name: action.name,
        filename: action.filename,
      });
    }
    case types.OPEN_QUERY_SUCCESS: {
      return changeStateByCurrentQuery(state, {
        name: action.name,
        query: action.query,
      });
    }
    case types.OPEN_QUERY_FAILURE:
    case types.SAVE_QUERY_FAILURE: {
      return changeStateByCurrentQuery(state, {
        error: action.error,
      });
    }
    default : return state;
  }
}


function addNewQuery(state, action) {
  if (action.reconnecting) {
    return state;
  }

  const configItemsPerPage = action.config && action.config.resultItemsPerPage;
  const itemsPerPage = (
    configItemsPerPage
    || state.resultItemsPerPage
    || INITIAL_STATE.resultItemsPerPage
  );

  let enabledAutoComplete = INITIAL_STATE.enabledAutoComplete;
  if (action.config && action.config.enabledAutoComplete !== undefined) {
    enabledAutoComplete = action.config.enabledAutoComplete;
  }

  let enabledLiveAutoComplete = INITIAL_STATE.enabledLiveAutoComplete;
  if (action.config && action.config.enabledLiveAutoComplete !== undefined) {
    enabledLiveAutoComplete = action.config.enabledLiveAutoComplete;
  }

  const newId = state.lastCreatedId + 1;
  const newQuery = {
    id: newId,
    database: action.database,
    name: createQueryName(newId, action.database, action.table),
    filename: null,
    isExecuting: false,
    isDefaultSelect: false,
    didInvalidate: true,
    query: '',
    selectedQuery: '',
    queryHistory: [],
    results: null,
    error: null,
    copied: null,
    resultItemsPerPage: itemsPerPage,
  };

  return {
    ...state,
    lastCreatedId: newQuery.id,
    currentQueryId: newQuery.id,
    resultItemsPerPage: itemsPerPage,
    enabledAutoComplete,
    enabledLiveAutoComplete,
    queryIds: [...state.queryIds, newQuery.id],
    queriesById: {
      ...state.queriesById,
      [newQuery.id]: newQuery,
    },
  };
}


function changeStateByCurrentQuery(oldFullState, newCurrentQueryState, options = {}) {
  const oldQueryState = oldFullState.queriesById[oldFullState.currentQueryId];

  oldQueryState.name = newCurrentQueryState.name || oldQueryState.name;
  if (options.table) {
    oldQueryState.name = createQueryName(
      oldFullState.currentQueryId,
      oldQueryState.database,
      options.table
    );
  }

  return {
    ...oldFullState,
    queriesById: {
      ...oldFullState.queriesById,
      [oldFullState.currentQueryId]: {
        ...oldQueryState,
        ...newCurrentQueryState,
      },
    },
  };
}

function createQueryName (id, database, table) {
  return (
    table
    ? `${database} / ${table} #${id}`
    : `${database} #${id}`
  );
}
