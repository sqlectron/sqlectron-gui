import { LODAD_DABATASES } from '../constants/action-types';


export function loadDatabases() {
  const databases = [
    {
      name: 'Database1',
      tables: [
        'db1-first-table',
        'db1-second-table'
      ]
    },
    {
      name: 'Database1',
      tables: [
        'db2-first-table',
        'db2-second-table'
      ]
    }
  ];
  return { type: LODAD_DABATASES, databases };
}

export function dropDatabase(database) {
  return loadDatabases();
}
