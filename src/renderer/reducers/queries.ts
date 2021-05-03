import { Action, Reducer } from 'redux';
import * as connTypes from '../actions/connections';
import * as types from '../actions/queries';

export interface Query {
  id: string;
  database: string;
  name: string;
  filename: null | string;
  isExecuting: boolean;
  isDefaultSelect: boolean;
  didInvalidate: boolean;
  query: string;
  selectedQuery: string;
  queryHistory: Array<string>;
  results: null | [];
  error: null | Error;
  copied: null | boolean;
  resultItemsPerPage: number;
}

export interface QueryAction extends Action {
  error: Error;
  type: string;
  id: string;
  isDefaultSelect: boolean;
  query: string;
  name: string;
  filename: string;
  selectedQuery: string;
  table: string;
  results: string;
}

export interface QueryState {
  lastCreatedId: number;
  currentQueryId: null | string;
  queryIds: Array<string>;
  queriesById: {
    [queryId: string]: Query;
  };
  resultItemsPerPage: number;
  enabledAutoComplete: boolean;
  enabledLiveAutoComplete: boolean;
}

const INITIAL_STATE: QueryState = {
  lastCreatedId: 0,
  currentQueryId: null,
  queryIds: [],
  queriesById: {},
  resultItemsPerPage: 100,
  enabledAutoComplete: true,
  enabledLiveAutoComplete: true,
};

const queryReducer: Reducer<QueryState> = function (
  state: QueryState = INITIAL_STATE,
  action,
): QueryState {
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

      const { database } = state.queriesById[state.currentQueryId as string];
      const index = state.queryIds.indexOf(state.currentQueryId as string);

      if (state.queryIds.length === 1) {
        newState.currentQueryId = null;
      } else if (index > 0) {
        newState.currentQueryId = state.queryIds[index - 1];
      } else {
        newState.currentQueryId = state.queryIds[index + 1];
      }

      newState.queryIds.splice(index, 1);
      delete newState.queriesById[state.currentQueryId as string];

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
          ...state.queriesById[state.currentQueryId as string].queryHistory,
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
      return changeStateByCurrentQuery(
        state,
        {
          query: action.query,
          selectedQuery: action.selectedQuery,
          copied: false,
        },
        { table: action.table },
      );
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
    case types.COPY_QUERY_RESULT_TO_CLIPBOARD_FAILURE: {
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
        filename: action.filename,
      });
    }
    case types.OPEN_QUERY_FAILURE:
    case types.SAVE_QUERY_FAILURE: {
      return changeStateByCurrentQuery(state, {
        error: action.error,
      });
    }
    default:
      return state;
  }
};

function addNewQuery(state, action) {
  if (action.reconnecting) {
    return state;
  }

  let { enabledAutoComplete, enabledLiveAutoComplete, resultItemsPerPage } = INITIAL_STATE;

  const config = action.config && action.config.data;

  if (config?.resultItemsPerPage !== undefined) {
    resultItemsPerPage = config?.resultItemsPerPage;
  } else if (state.resultItemsPerPage !== undefined) {
    resultItemsPerPage = state.resultItemsPerPage;
  }

  if (config?.enabledAutoComplete !== undefined) {
    enabledAutoComplete = config?.enabledAutoComplete;
  }

  if (config?.enabledLiveAutoComplete !== undefined) {
    enabledLiveAutoComplete = config?.enabledLiveAutoComplete;
  }

  const newId = state.lastCreatedId + 1;
  const newQuery: Query = {
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
    resultItemsPerPage,
  };

  return {
    ...state,
    lastCreatedId: newQuery.id,
    currentQueryId: newQuery.id,
    resultItemsPerPage,
    enabledAutoComplete,
    enabledLiveAutoComplete,
    queryIds: [...state.queryIds, newQuery.id],
    queriesById: {
      ...state.queriesById,
      [newQuery.id]: newQuery,
    },
  };
}

function changeStateByCurrentQuery(
  oldFullState,
  newCurrentQueryState,
  options: { table?: string } = {},
) {
  const oldQueryState = oldFullState.queriesById[oldFullState.currentQueryId];

  oldQueryState.name = newCurrentQueryState.name || oldQueryState.name;
  if (options.table) {
    oldQueryState.name = createQueryName(
      oldFullState.currentQueryId,
      oldQueryState.database,
      options.table,
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

function createQueryName(id, database, table) {
  return table ? `${database} / ${table} #${id}` : `${database} #${id}`;
}

export default queryReducer;
