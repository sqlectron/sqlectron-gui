import React, { Component, PropTypes } from 'react';
import Loader from './loader.jsx';


const STYLE = {
  database: { cursor: 'pointer' },
};


export default class DatabaseList extends Component {
  static propTypes = {
    databases: PropTypes.array.isRequired,
    tablesByDatabase: PropTypes.object.isRequired,
    onSelectDatabase: PropTypes.func.isRequired,
    onSelectTable: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
  }

  getTablesByDatabase({ name }) {
    const { tablesByDatabase } = this.props;
    return tablesByDatabase[name] || [];
  }

  render() {
    const { databases, onSelectDatabase, onSelectTable } = this.props;
    if (!databases.length) { return <Loader type="active" />; }

    return (<div>
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
