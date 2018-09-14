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
import { combineReducers } from 'redux';
import config from './config';
import databases from './databases';
import servers from './servers';
import queries from './queries';
import connections from './connections';
import schemas from './schemas';
import tables from './tables';
import status from './status';
import views from './views';
import routines from './routines';
import columns from './columns';
import triggers from './triggers';
import indexes from './indexes';
import sqlscripts from './sqlscripts';
import keys from './keys';


const rootReducer = combineReducers({
  config,
  databases,
  servers,
  queries,
  connections,
  schemas,
  tables,
  status,
  views,
  routines,
  columns,
  triggers,
  indexes,
  sqlscripts,
  keys,
});


export default rootReducer;
