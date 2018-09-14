/**
 * unified-dataloader-gui
 * Copyright (C) 2018 Armarti Industries
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import * as connTypes from '../actions/connections';
import * as dbTypes from '../actions/databases';
import * as queryTypes from '../actions/queries';
import * as types from '../actions/schemas';


const INITIAL_STATE = {
  isFetching: false,
  didInvalidate: false,
  itemsByDatabase: {},
  selectedTablesForDiagram: [],
};


const COMMANDS_TRIGER_REFRESH = ['CREATE_SCHEMA', 'DROP_SCHEMA'];


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case connTypes.CONNECTION_REQUEST: {
      return action.isServerConnection
        ? { ...INITIAL_STATE, didInvalidate: true }
        : state;
    }
    case types.FETCH_SCHEMAS_REQUEST: {
      return { ...state, isFetching: true, didInvalidate: false, error: null };
    }
    case types.FETCH_SCHEMAS_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        itemsByDatabase: {
          ...state.itemsByDatabase,
          [action.database]: action.schemas.map(name => ({ name })),
        },
        error: null,
      };
    }
    case types.FETCH_SCHEMAS_FAILURE: {
      return {
        ...state,
        isFetching: false,
        didInvalidate: true,
        error: action.error,
      };
    }
    case queryTypes.EXECUTE_QUERY_SUCCESS: {
      return {
        ...state,
        didInvalidate: action.results
          .some(({ command }) => COMMANDS_TRIGER_REFRESH.includes(command)),
      };
    }
    case dbTypes.REFRESH_DATABASES: {
      return {
        ...state,
        didInvalidate: true,
      };
    }
    case dbTypes.CLOSE_DATABASE_DIAGRAM: {
      return {
        ...state,
        selectedSchemasForDiagram: null,
      };
    }
    default : return state;
  }
}
