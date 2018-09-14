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
import * as types from '../actions/sqlscripts';


const INITIAL_STATE = {
  isFetching: false,
  didInvalidate: false,
  scriptsByObject: {},
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case connTypes.CONNECTION_REQUEST: {
      return action.isServerConnection
        ? { ...INITIAL_STATE, didInvalidate: true }
        : state;
    }
    case types.GET_SCRIPT_REQUEST: {
      return {
        ...state,
        scriptType: action.scriptType,
        isFetching: true,
        didInvalidate: false,
        error: null,
      };
    }
    case types.GET_SCRIPT_SUCCESS: {
      const scriptsByItem = !state.scriptsByObject[action.database]
        ? null
        : state.scriptsByObject[action.database][action.item];
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        error: null,
        scriptsByObject: {
          ...state.scriptsByObject,
          [action.database]: {
            ...state.scriptsByObject[action.database],
            [action.item]: {
              ...scriptsByItem,
              objectType: action.objectType,
              [action.actionType]: action.script,
            },
          },
        },
      };
    }
    case types.GET_SCRIPT_FAILURE: {
      return {
        ...state,
        isFetching: false,
        didInvalidate: true,
        error: action.error,
      };
    }
    default : return state;
  }
}
