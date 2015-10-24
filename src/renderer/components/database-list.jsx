import React, { Component, PropTypes } from 'react';
import LoadingPage from './loading.jsx';


const STYLE = {
  database: { cursor: 'pointer' },
};


export default class DatabaseList extends Component {
  static propTypes = {
    databases: PropTypes.array.isRequired,
    tablesByDatabase: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
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
    if (!databases.length) { return <LoadingPage />; }

    return (<div>
      {databases.map((database, idx) =>
        <div className="item" key={idx} style={{display: database.visible ? 'block' : 'none'}}>
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
                  style={{...STYLE.database, textDecoration: table.visible ? 'none' : 'line-through'}}
                  onDoubleClick={() => onSelectTable(table.name)}>
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
