import { LODAD_DABATASES } from '../constants/action-types';


export function loadDatabases() {
  const databases = [
    { Name: 'Database1', Description: 'First Database', 'Install Date': '01/03/2014' },
    { Name: 'Database1', Description: 'Second Databse', 'Install Date': '05/05/2015' }
  ];
  return { type: LODAD_DABATASES, databases };
}

export function dropDatabase(database) {
  return loadDatabases();
}
