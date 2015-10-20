
import { LOAD_DATABASES_SUCCESS, FILTER_DATABASES } from '../actions/types';


const INITIAL_STATE = [];


export default function databases(state = INITIAL_STATE, action) {
  switch (action.type) {
  case LOAD_DATABASES_SUCCESS:
    return loadAll(action.databases);
  case FILTER_DATABASES:
    return filter(state, action.name);
  default:
    return state;
  }
}


function loadAll(dbs) {
  return dbs.map(db => {
    return {
      ...db,
      visible: true,
      tables: db.tables.map(tb =>{
        return { ...tb, visible: true };
      }),
    };
  });
}


function filter(dbs, name) {
  if (!name) { return loadAll(dbs); }

  const regex = RegExp(name, 'i');
  return dbs.map(db => {
    return {
      ...db,
      tables: db.tables.map(tb => {
        return { ...tb, visible: regex.test(tb.name) };
      }),
      visible: regex.test(db.name) || db.tables.some(tb => tb.visible),
    };
  });
}
