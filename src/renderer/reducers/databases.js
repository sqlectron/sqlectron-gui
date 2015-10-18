
import { LOAD_DATABASES_SUCCESS, FILTER_DATABASES } from '../actions/types';

const initialState = [];

export default function databases(state = initialState, action) {
  switch (action.type) {
  case LOAD_DATABASES_SUCCESS:
    return loadAll(action.databases);
  case FILTER_DATABASES:
    if (!action.name) {
      return loadAll(state);
    }

    return state.map(db => {
      const regex = RegExp(action.name, 'i');
      db.tables = db.tables.map(tb => {
        tb.visible = regex.test(tb.name);
        return tb;
      });
      db.visible = regex.test(db.name) || db.tables.some(tb => tb.visible);
      return db;
    });

  default:
    return state;
  }
}


function loadAll(dbs) {
  return dbs.map(db => {
    db.visible = true;
    db.tables = db.tables.map(tb =>{
      tb.visible = true;
      return tb;
    });
    return db;
  });
}
