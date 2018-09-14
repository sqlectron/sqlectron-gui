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
import * as types from '../actions/config';


const INITIAL_STATE = {
  isSaving: false,
  isEditing: false,
  path: null,
  data: null,
  error: null,
  isLoaded: false,
};


export default function config(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.LOAD_CONFIG_SUCCESS:
      return {
        ...state,
        data: action.config,
        path: action.path,
        isLoaded: true,
      };
    case types.LOAD_CONFIG_FAILURE: {
      return {
        ...state,
        error: action.error,
        isLoaded: true,
      };
    }
    case types.START_EDITING_CONFIG: {
      return {
        ...state,
        isSaving: false,
        isEditing: true,
      };
    }
    case types.FINISH_EDITING_CONFIG: {
      return {
        ...state,
        isSaving: false,
        isEditing: false,
        isLoaded: true,
        error: null,
      };
    }
    case types.SAVE_CONFIG_REQUEST: {
      return {
        ...state,
        isSaving: true,
      };
    }
    case types.SAVE_CONFIG_SUCCESS: {
      return {
        data: {
          ...state.data,
          ...action.config,
        },
        isSaving: false,
      };
    }
    default:
      return state;
  }
}
