import React, { Component, PropTypes } from 'react';


const STYLE = {
  database: {
    cursor: 'pointer',
    wordBreak: 'break-all',
  },
};


export default class DatabaseList extends Component {
  static propTypes = {
    databases: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    tablesByDatabase: PropTypes.object.isRequired,
    onSelectDatabase: PropTypes.func.isRequired,
    onSelectTable: PropTypes.func.isRequired,
  }

  getTablesByDatabase({ name }) {
    const { tablesByDatabase } = this.props;
    return tablesByDatabase[name] || [];
  }

  render() {
    const { databases, isFetching, onSelectDatabase, onSelectTable } = this.props;
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

    return (<div className="item" style={{padding: 0}}>
      {databases.map((database, idx) =>
        <div className="item" key={idx}>
          <i className="grid database icon"></i>
          <span style={STYLE.database}
            onDoubleClick={() => onSelectDatabase(database)}>
            {database.name}
          </span>
          <div className="menu">
            {this.getTablesByDatabase(database).map((table, idxChild) => {
              return (
                <span key={idxChild}
                  className="item"
                  style={STYLE.database}
                  onDoubleClick={() => onSelectTable(database, table)}>
                  {table.name}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>);
  }
}
