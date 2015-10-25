import * as connTypes from '../actions/connections';
import * as types from '../actions/databases';


const INITIAL_STATE = {
  isFetching: false,
  didInvalidate: false,
  items: [],
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
  case connTypes.CONNECTION_SUCCESS: {
    return { ...state, items: [], didInvalidate: true };
  }
  case types.FETCH_DATABASES_REQUEST: {
    return { ...state, isFetching: true, didInvalidate: false, error: null };
  }
  case types.FETCH_DATABASES_SUCCESS: {
    return {
      ...state,
      isFetching: false,
      didInvalidate: false,
      // items: action.databases,
      items: action.databases.map(db => ({ name: db, visible: true, tables: [] })),
      error: null,
    };
  }
  case types.FETCH_DATABASES_FAILURE: {
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


//
// import { LOAD_DATABASES_SUCCESS, FILTER_DATABASES } from '../actions/types';
//
//
// const INITIAL_STATE = [];
//
//
// export default function databases(state = INITIAL_STATE, action) {
//   switch (action.type) {
//   case LOAD_DATABASES_SUCCESS:
//     return loadAll(action.databases);
//   case FILTER_DATABASES:
//     return filter(state, action.name);
//   default:
//     return state;
//   }
// }
//
//
// function loadAll(dbs) {
//   return dbs.map(db => {
//     return {
//       ...db,
//       visible: true,
//       tables: db.tables.map(tb =>{
//         return { ...tb, visible: true };
//       }),
//     };
//   });
// }
//
//
// function filter(dbs, name) {
//   if (!name) { return loadAll(dbs); }
//
//   const regex = RegExp(name, 'i');
//   return dbs.map(db => {
//     return {
//       ...db,
//       tables: db.tables.map(tb => {
//         return { ...tb, visible: regex.test(tb.name) };
//       }),
//       visible: regex.test(db.name) || db.tables.some(tb => tb.visible),
//     };
//   });
// }
