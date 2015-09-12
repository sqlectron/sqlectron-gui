import { combineReducers } from 'redux';
import dialog from './dialog';
import databases from './databases';
import connections from './connections';

const rootReducer = combineReducers({
  dialog,
  databases,
  connections
});

export default rootReducer;
