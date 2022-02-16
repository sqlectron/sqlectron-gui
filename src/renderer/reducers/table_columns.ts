import { Action, Reducer } from 'redux';
import * as table_types from '../actions/tables';
import * as column_types from '../actions/columns';

export interface Column {
  columnName: string;
  dataType: string;
}

export interface TableColumnAction extends Action {
  columns: Array<Column>;
  tables: Array<string>;
  table: string;
}

export interface TableColumnState {
  [table: string]: Array<string>;
}

const INITIAL_STATE: TableColumnState = {};

const tableColumnReducer: Reducer<TableColumnState> = function (
  state: TableColumnState = INITIAL_STATE,
  action,
): TableColumnState {
  switch (action.type) {
    case table_types.FETCH_TABLES_SUCCESS: {
      let newstate = {
        ...state,
      };
      for (let i = 0; i < action.tables.length; i++) {
        if (!(action.tables[i].name in state))
          newstate = {
            ...newstate,
            [action.tables[i].name]: [],
          };
      }

      return newstate;
    }
    case column_types.FETCH_ALL_COLUMNS_SUCCESS: {
      return {
        ...state,
        [action.table]: action.columns,
      };
    }

    default:
      return state;
  }
};

export default tableColumnReducer;
