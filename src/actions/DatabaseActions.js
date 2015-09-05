import {LODAD_DABATASES} from '../constants/ActionTypes';
import _ from 'lodash';


export function loadDatabases() {
  return perform => {
    console.info('[DatabaseActions.js] ', 'start');
    console.info('[DatabaseActions.js] ', 'got them from stdout');
    const databases = [
      { Name: 'Database1', Description: 'First Database', 'Install Date': '01/03/2014' },
      { Name: 'Database1', Description: 'Second Databse', 'Install Date': '05/05/2015' }
    ];
    console.info('[DatabaseActions.js] ', 'end parsing');
    perform({type: LODAD_DABATASES, databases});
  };
}

export function dropDatabase(database) {
  return perform => {
    // console.info('[DatabaseActions.js] ', stdout);
    // perform(loadDatabases());
  };
}
