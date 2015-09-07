import { combineReducers } from 'redux';
// import todos from './todos';
import dialog from './dialog';
import databases from './databases';

const rootReducer = combineReducers({
  // todos
  dialog,
  databases
});

export default rootReducer;
