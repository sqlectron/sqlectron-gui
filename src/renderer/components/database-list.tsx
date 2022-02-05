import React, { FC, RefObject } from 'react';
import DatabaseListItem from './database-list-item';
import { Database } from '../reducers/databases';
import { DbTable } from '../../common/types/database';
import { useAppSelector } from '../hooks/redux';

interface Props {
  client: string;
  databases: Database[];
  databaseRefs: Record<string, RefObject<HTMLDivElement>>;
  currentDB: string | null;
  isFetching: boolean;
  onSelectDatabase: (database: Database) => void;
  onExecuteDefaultQuery: (database: Database, table: DbTable) => void;
  onSelectTable: (database: Database, table: DbTable) => void;
  onGetSQLScript: (
    database: Database,
    item: { name: string; schema?: string },
    actionType,
    objectType,
  ) => void;
  onRefreshDatabase: (database: Database) => void;
  onOpenTab: (database: Database) => void;
  onShowDiagramModal: (database: Database) => void;
}

const DatabaseList: FC<Props> = ({
  client,
  databases,
  databaseRefs,
  currentDB,
  isFetching,
  onSelectDatabase,
  onExecuteDefaultQuery,
  onSelectTable,
  onGetSQLScript,
  onRefreshDatabase,
  onOpenTab,
  onShowDiagramModal,
}) => {
  const {
    tablesByDatabase,
    columnsByTable,
    triggersByTable,
    indexesByTable,
    viewsByDatabase,
    functionsByDatabase,
    proceduresByDatabase,
  } = useAppSelector((state) => ({
    tablesByDatabase: state.tables.itemsByDatabase,
    columnsByTable: state.columns.columnsByTable,
    triggersByTable: state.triggers.triggersByTable,
    indexesByTable: state.indexes.indexesByTable,
    viewsByDatabase: state.views.viewsByDatabase,
    functionsByDatabase: state.routines.functionsByDatabase,
    proceduresByDatabase: state.routines.proceduresByDatabase,
  }));

  if (isFetching) {
    return <div className="ui grey item">Loading...</div>;
  }

  if (!databases.length) {
    return <div className="ui grey item">No results found</div>;
  }

  return (
    <div className="item" style={{ padding: 0 }}>
      {databases.map((database) => (
        <DatabaseListItem
          databaseRef={databaseRefs[database.name]}
          key={database.name}
          currentDB={currentDB}
          client={client}
          database={database}
          tables={tablesByDatabase[database.name]}
          columnsByTable={columnsByTable[database.name]}
          triggersByTable={triggersByTable[database.name]}
          indexesByTable={indexesByTable[database.name]}
          views={viewsByDatabase[database.name]}
          functions={functionsByDatabase[database.name]}
          procedures={proceduresByDatabase[database.name]}
          onExecuteDefaultQuery={onExecuteDefaultQuery}
          onSelectTable={onSelectTable}
          onSelectDatabase={onSelectDatabase}
          onGetSQLScript={onGetSQLScript}
          onRefreshDatabase={onRefreshDatabase}
          onOpenTab={onOpenTab}
          onShowDiagramModal={onShowDiagramModal}
        />
      ))}
    </div>
  );
};

DatabaseList.displayName = 'DatabaseList';
export default DatabaseList;
