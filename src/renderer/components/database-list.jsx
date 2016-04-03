import React, { Component, PropTypes } from 'react';
import DbMetadataList from './db-metadata-list.jsx';


const STYLE = {
  database: {
    cursor: 'pointer',
    wordBreak: 'break-all',
  },
  collapse: {
    cursor: 'pointer',
  },
};


export default class DatabaseList extends Component {
  static propTypes = {
    databases: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    tablesByDatabase: PropTypes.object.isRequired,
    viewsByDatabase: PropTypes.object.isRequired,
    functionsByDatabase: PropTypes.object.isRequired,
    proceduresByDatabase: PropTypes.object.isRequired,
    onSelectDatabase: PropTypes.func.isRequired,
    onSelectTable: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  getTablesByDatabase({ name }) {
    const { tablesByDatabase } = this.props;
    return tablesByDatabase[name] || [];
  }

  getViewsByDatabase({ name }) {
    const { viewsByDatabase } = this.props;
    return viewsByDatabase[name] || [];
  }

  getFunctionsByDatabase({ name }) {
    const { functionsByDatabase } = this.props;
    return functionsByDatabase[name] || [];
  }

  getProceduresByDatabase({ name }) {
    const { proceduresByDatabase } = this.props;
    return proceduresByDatabase[name] || [];
  }

  toggleCollapse(database) {
    this.setState({ [database.name]: !this.state[database.name] });
  }

  renderCollapseButton(database, tables) {
    if (!tables.length) {
      return null;
    }

    if (this.state[database.name]) {
      return (
        <i className="plus square outline icon"
          style={STYLE.collapse}
          title="Expand"
          onClick={() => this.toggleCollapse(database)} />
      );
    }

    return (
      <i className="minus square outline icon"
        style={STYLE.collapse}
        title="Collapse"
        onClick={() => this.toggleCollapse(database)} />
    );
  }

  renderDatabases(databases) {
    const { onSelectDatabase, onSelectTable } = this.props;

    return databases.map((database, idx) => {
      const tables = this.getTablesByDatabase(database);
      const views = this.getViewsByDatabase(database);
      const functions = this.getFunctionsByDatabase(database);
      const procedures = this.getProceduresByDatabase(database);
      const shouldShow = !this.state[database.name] && !!tables.length;
      return (
        <div className="item" key={idx}>
          <i className="grid database icon"></i>
          {this.renderCollapseButton(database, tables)}
          <span style={STYLE.database}
            onDoubleClick={() => onSelectDatabase(database)}>
            {database.name}
          </span>
          <div className="menu">
            <DbMetadataList
              tables={tables}
              views={views}
              functions={functions}
              procedures={procedures}
              database={database}
              shouldShow={shouldShow}
              onSelectTable={onSelectTable} />
          </div>
        </div>
      );
    });
  }

  render() {
    const { databases, isFetching } = this.props;
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
        {this.renderDatabases(databases)}
      </div>
    );
  }
}
