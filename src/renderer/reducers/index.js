import { combineReducers } from 'redux';
import config from './config';
import databases from './databases';
import servers from './servers';
import queries from './queries';
import connections from './connections';
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
