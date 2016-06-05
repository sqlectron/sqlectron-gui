import React, { Component, PropTypes } from 'react';
import DatabaseListItem from './database-list-item.jsx';


export default class DatabaseList extends Component {
  static propTypes = {
    databases: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    tablesByDatabase: PropTypes.object.isRequired,
    columnsByTable: PropTypes.object.isRequired,
    triggersByTable: PropTypes.object.isRequired,
    viewsByDatabase: PropTypes.object.isRequired,
    functionsByDatabase: PropTypes.object.isRequired,
    proceduresByDatabase: PropTypes.object.isRequired,
    onSelectDatabase: PropTypes.func.isRequired,
    onExecuteDefaultQuery: PropTypes.func.isRequired,
    onSelectTable: PropTypes.func.isRequired,
    onGetSQLScript: PropTypes.func.isRequired,
    onRefreshDatabase: PropTypes.func.isRequired,
    onShowDiagramModal: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  focus(database) {
    this.refs[database].focus();
  }

  render() {
    const {
      databases,
      isFetching,
      tablesByDatabase,
      columnsByTable,
      triggersByTable,
      viewsByDatabase,
      functionsByDatabase,
      proceduresByDatabase,
      onExecuteDefaultQuery,
      onSelectTable,
      onSelectDatabase,
      onGetSQLScript,
      onRefreshDatabase,
      onShowDiagramModal,
    } = this.props;

    if (isFetching) {
      return (
        <div className="ui grey item">Loading...</div>
      );
    }

    if (!databases.length) {
      return (
        <div className="ui grey item">No results found</div>
      );
    }

    return (
      <div className="item" style={{padding: 0}}>
      {
        databases.map(database => (
          <DatabaseListItem
            ref={database.name}
            key={database.name}
            database={database}
            tables={tablesByDatabase[database.name]}
            columnsByTable={columnsByTable[database.name]}
            triggersByTable={triggersByTable[database.name]}
            views={viewsByDatabase[database.name]}
            functions={functionsByDatabase[database.name]}
            procedures={proceduresByDatabase[database.name]}
            onExecuteDefaultQuery={onExecuteDefaultQuery}
            onSelectTable={onSelectTable}
            onSelectDatabase={onSelectDatabase}
            onGetSQLScript={onGetSQLScript}
            onRefreshDatabase={onRefreshDatabase}
            onShowDiagramModal={onShowDiagramModal} />
        ))
      }
      </div>
    );
  }
}
