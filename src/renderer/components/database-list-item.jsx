import React, { Component, PropTypes } from 'react';
import DatabaseListItemMetatada from './database-list-item-metadata.jsx';
import DatabaseFilter from './database-filter.jsx';
import { remote } from 'electron'; // eslint-disable-line import/no-unresolved


const { Menu, MenuItem } = remote;


const STYLE = {
  database: {
    fontSize: '0.85em',
    color: '#636363',
    wordBreak: 'break-all',
    cursor: 'pointer',
    // force menu item go over the parent padding
    // this way allows the whole line be clickable
    position: 'abosolute',
    margin: '-0.92857143em -1.14285714em',
    padding: '0.92857143em 1.14285714em',
    display: 'block',
  },
  activeDatabase: {
    backgroundColor: '#FFFAF3',
    boxShadow: '0 0 0 1px #C9BA9B inset,0 0 0 0 transparent',
  },
  loadedDatabase: {
    backgroundColor: '#F8FFFF',
  },
};


export default class DatabaseListItem extends Component {
  static propTypes = {
    client: PropTypes.string.isRequired,
    tables: PropTypes.array,
    columnsByTable: PropTypes.object,
    triggersByTable: PropTypes.object,
    indexesByTable: PropTypes.object,
    views: PropTypes.array,
    functions: PropTypes.array,
    procedures: PropTypes.array,
    currentDB: PropTypes.string,
    database: PropTypes.object.isRequired,
    onExecuteDefaultQuery: PropTypes.func.isRequired,
    onSelectTable: PropTypes.func.isRequired,
    onSelectDatabase: PropTypes.func.isRequired,
    onGetSQLScript: PropTypes.func.isRequired,
    onRefreshDatabase: PropTypes.func.isRequired,
    onShowDiagramModal: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.contextMenu = null;
  }

  componentWillReceiveProps(nextProps) {
    if (this.contextMenu || !this.isMetadataLoaded(nextProps)) {
      return;
    }

    this.contextMenu = new Menu();
    this.contextMenu.append(new MenuItem({
      label: 'Refresh Database',
      click: this.props.onRefreshDatabase.bind(this, nextProps.database),
    }));
    this.contextMenu.append(new MenuItem({
      label: 'Show Database Diagram',
      click: this.props.onShowDiagramModal.bind(this, nextProps.database),
    }));
  }

  onContextMenu(event) {
    event.preventDefault();
    if (this.contextMenu) {
      this.contextMenu.popup(event.clientX, event.clientY);
    }
  }

  onFilterChange(value) {
    this.setState({ filter: value });
  }

  onHeaderDoubleClick(database) {
    if (!this.isMetadataLoaded()) {
      this.props.onSelectDatabase(database);
      return;
    }

    this.toggleCollapse();
  }

  filterItems(filterInput, items) {
    const regex = RegExp(filterInput, 'i');
    return items.filter(item => regex.test(`${item.schema}.${item.name}`));
  }

  focus() {
    // If search is toggled for certain database that is collapsed then toggle collapse.
    if (this.state.collapsed) {
      this.toggleCollapse();
    }

    this.refs.filter.focus();
  }

  isMetadataLoaded(props) {
    const { tables, views, functions, procedures } = (props || this.props);
    return tables && views && functions && procedures;
  }

  toggleCollapse() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  renderBody(isMetadataLoaded, isCurrentDB) {
    const { filter } = this.state;
    const {
      client,
      tables,
      columnsByTable,
      triggersByTable,
      indexesByTable,
      views,
      functions,
      procedures,
      database,
      onExecuteDefaultQuery,
      onSelectTable,
      onGetSQLScript,
    } = this.props;

    let filteredTables;
    let filteredViews;
    let filteredFunctions;
    let filteredProcedures;

    const cssStyleItems = {};
    if (this.state.collapsed || !isMetadataLoaded) {
      cssStyleItems.display = 'none';
    } else {
      filteredTables = this.filterItems(filter, tables);
      filteredViews = this.filterItems(filter, views);
      filteredFunctions = this.filterItems(filter, functions);
      filteredProcedures = this.filterItems(filter, procedures);
    }

    const loadingContent = (
      <div className="ui list">
        <div className="item">
          <DatabaseFilter
            isFetching
            placeholder="Loading..."
            onFilterChange={() => {}} />
        </div>
      </div>
    );

    const fullConent = (
      <div className="ui list" style={cssStyleItems}>
        <div className="item" style={cssStyleItems}>
          <DatabaseFilter
            ref="filter"
            value={filter}
            isFetching={!isMetadataLoaded}
            onFilterChange={::this.onFilterChange} />
        </div>
        <DatabaseListItemMetatada
          title="Tables"
          client={client}
          items={filteredTables || tables}
          columnsByTable={columnsByTable}
          triggersByTable={triggersByTable}
          indexesByTable={indexesByTable}
          database={database}
          onExecuteDefaultQuery={onExecuteDefaultQuery}
          onSelectItem={onSelectTable}
          onGetSQLScript={onGetSQLScript} />
        <DatabaseListItemMetatada
          collapsed
          title="Views"
          client={client}
          items={filteredViews || views}
          database={database}
          onExecuteDefaultQuery={onExecuteDefaultQuery}
          onGetSQLScript={onGetSQLScript} />
        <DatabaseListItemMetatada
          collapsed
          title="Functions"
          client={client}
          items={filteredFunctions || functions}
          database={database}
          onGetSQLScript={onGetSQLScript} />
        <DatabaseListItemMetatada
          collapsed
          title="Procedures"
          client={client}
          items={filteredProcedures || procedures}
          database={database}
          onGetSQLScript={onGetSQLScript} />
      </div>
    );

    return (
      isCurrentDB && !isMetadataLoaded
        ? loadingContent
        : fullConent
    );
  }

  renderHeader(isMetadataLoaded) {
    const { database } = this.props;

    const collapseCssClass = !isMetadataLoaded || this.state.collapsed ? 'right' : 'down';

    return (
      <span
        className="header"
        onClick={() => this.onHeaderDoubleClick(database)}
        onContextMenu={::this.onContextMenu}
        style={STYLE.database}>
        <i className={`${collapseCssClass} triangle icon`}></i>
        <i className="database icon"></i>
        {database.name}
      </span>
    );
  }

  render() {
    const { database, currentDB } = this.props;

    const isMetadataLoaded = this.isMetadataLoaded();
    const isCurrentDB = currentDB === database.name;

    let styleComponent = {};
    if (isCurrentDB) {
      styleComponent = STYLE.activeDatabase;
    } else if (this.isMetadataLoaded()) {
      styleComponent = STYLE.loadedDatabase;
    }

    return (
      <div className={`item ${isCurrentDB ? 'active' : ''}`} style={styleComponent}>
        {this.renderHeader(isMetadataLoaded)}
        {this.renderBody(isMetadataLoaded, isCurrentDB)}
      </div>
    );
  }
}
