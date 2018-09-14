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
//import cloneDeep from 'lodash.clonedeep';
import _ from 'lodash';
const cloneDeep = _.cloneDeep;

import { config, sqlectron } from '../../browser/remote';


export const LOAD_CONFIG_REQUEST = 'LOAD_CONFIG_REQUEST';
export const LOAD_CONFIG_SUCCESS = 'LOAD_CONFIG_SUCCESS';
export const LOAD_CONFIG_FAILURE = 'LOAD_CONFIG_FAILURE';
export const SAVE_CONFIG_REQUEST = 'SAVE_CONFIG_REQUEST';
export const SAVE_CONFIG_SUCCESS = 'SAVE_CONFIG_SUCCESS';
export const SAVE_CONFIG_FAILURE = 'SAVE_CONFIG_FAILURE';
export const START_EDITING_CONFIG = 'START_EDITING_CONFIG';
export const FINISH_EDITING_CONFIG = 'FINISH_EDITING_CONFIG';


export function loadConfig() {
  return async dispatch => {
    dispatch({ type: LOAD_CONFIG_REQUEST });
    try {
      const forceCleanCache = true;
      const configPath = await sqlectron.config.path();
      const remoteConfig = await config.get(forceCleanCache);

      // Remove any "reference" to the remote IPC object
      const configData = cloneDeep(remoteConfig);

      dispatch({ type: LOAD_CONFIG_SUCCESS, config: configData, path: configPath });
    } catch (error) {
      dispatch({ type: LOAD_CONFIG_FAILURE, error });
    }
  };
}


export function saveConfig(configData) {
  return async dispatch => {
    dispatch({ type: SAVE_CONFIG_REQUEST });
    try {
      await sqlectron.config.saveSettings(configData);
      dispatch({ type: SAVE_CONFIG_SUCCESS, config: configData });
    } catch (error) {
      dispatch({ type: SAVE_CONFIG_FAILURE, error });
    }
  };
}


export function startEditing(id) {
  return { type: START_EDITING_CONFIG, id };
}


export function finishEditing() {
  return { type: FINISH_EDITING_CONFIG };
}
