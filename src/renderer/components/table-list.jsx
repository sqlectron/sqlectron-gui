import React, { Component, PropTypes } from 'react';


export default class TableList extends Component {
  static propTypes = {
    tables: PropTypes.array.isRequired,
    database: PropTypes.object.isRequired,
    dbIsToggled: PropTypes.bool.isRequired,
    onSelectTable: PropTypes.func.isRequired,
  }

  renderTitle(tables) {
    const { dbIsToggled } = this.props;
    if (!tables.length || !dbIsToggled) {
      return null;
    }

    return (
      <span className="list-title">
        Tables
      </span>
    );
  }

  renderTables(database, tables) {
    const { dbIsToggled, onSelectTable } = this.props;
    if (!tables.length || !dbIsToggled) {
      return null;
    }

    return tables.map((table, idxChild) => {
      return (
        <span key={idxChild}
          className="item list-item"
          onDoubleClick={() => onSelectTable(database, table)}>
          {table.name}
        </span>
      );
    });
  }

  render() {
    const { tables, database } = this.props;

    return (
      <div className="item">
        {this.renderTitle(tables)}
        {this.renderTables(database, tables)}
      </div>
    );
  }
}
