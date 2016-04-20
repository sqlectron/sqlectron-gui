import React, { Component, PropTypes } from 'react';
import DatabaseListItem from './database-list-item.jsx';


export default class DatabaseList extends Component {
  static propTypes = {
    databases: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    tablesByDatabase: PropTypes.object.isRequired,
    viewsByDatabase: PropTypes.object.isRequired,
    functionsByDatabase: PropTypes.object.isRequired,
    proceduresByDatabase: PropTypes.object.isRequired,
    onSelectDatabase: PropTypes.func.isRequired,
    onDoubleClickTable: PropTypes.func.isRequired,
    onSelectTable: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    const {
      databases,
      isFetching,
      tablesByDatabase,
      viewsByDatabase,
      functionsByDatabase,
      proceduresByDatabase,
      onDoubleClickTable,
      onSelectTable,
      onSelectDatabase,
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
            key={database.name}
            database={database}
            tables={tablesByDatabase[database.name]}
            views={viewsByDatabase[database.name]}
            functions={functionsByDatabase[database.name]}
            procedures={proceduresByDatabase[database.name]}
            onDoubleClickTable={onDoubleClickTable}
            onSelectTable={onSelectTable}
            onSelectDatabase={onSelectDatabase} />
        ))
      }
      </div>
    );
  }
}
