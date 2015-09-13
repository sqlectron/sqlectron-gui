import { combineReducers } from 'redux';
import dialog from './dialog';
import databases from './databases';
import connections from './connections';
import queryResult from './query';

const rootReducer = combineReducers({
  dialog,
  databases,
  connections,
  queryResult
});

export default rootReducer;
