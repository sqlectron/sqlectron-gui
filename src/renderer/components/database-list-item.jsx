import React, { Component, PropTypes } from 'react';
import DatabaseListItemMetatada from './database-list-item-metadata.jsx';
import DatabaseFilter from './database-filter.jsx';


const STYLE = {
  database: {
    wordBreak: 'break-all',
    cursor: 'default',
  },
};


export default class DatabaseListItem extends Component {
  static propTypes = {
    tables: PropTypes.array,
    views: PropTypes.array,
    functions: PropTypes.array,
    procedures: PropTypes.array,
    database: PropTypes.object.isRequired,
    onDoubleClickTable: PropTypes.func.isRequired,
    onSelectTable: PropTypes.func.isRequired,
    onSelectDatabase: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  isMetadataLoaded() {
    const { tables, views, functions, procedures } = this.props;
    return tables && views && functions && procedures;
  }

  toggleCollapse() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  onFilterChange(value) {
    this.setState({ filter: value });
  }

  filterItems(filterInput, items) {
    const regex = RegExp(filterInput, 'i');
    return items.filter(item => regex.test(item.name));
  }

  renderCollapseButton() {
    if (!this.isMetadataLoaded()) {
      return null;
    }

    const title = this.state.collapsed ? 'Expand' : 'Collapse';
    const cssClass = this.state.collapsed ? 'plus' : 'minus';

    return (
      <i className={`${cssClass} square outline icon clickable`}
        title={title}
        onClick={::this.toggleCollapse} />
    );
  }

  render() {
    const { filter } = this.state;
    const {
      tables,
      views,
      functions,
      procedures,
      database,
      onDoubleClickTable,
      onSelectTable,
      onSelectDatabase
    } = this.props;
    let filteredTables, filteredViews, filteredFunctions, filteredProcedures;

    const cssStyleItems = {};
    const isMetadataLoaded = this.isMetadataLoaded();
    if (this.state.collapsed || !isMetadataLoaded) {
      cssStyleItems.display = 'none';
    } else {
      filteredTables = this.filterItems(filter, tables);
      filteredViews = this.filterItems(filter, views);
      filteredFunctions = this.filterItems(filter, functions);
      filteredProcedures = this.filterItems(filter, procedures);
    }

    return (
      <div className="item">
        <i className="grid database icon"></i>
        {this.renderCollapseButton()}
        <span style={STYLE.database}
          title="Click twice to connect or open new query"
          onDoubleClick={() => onSelectDatabase(database)}>
          {database.name}
        </span>
        <div className="ui list" style={cssStyleItems}>
          <div className="item" style={cssStyleItems}>
            <DatabaseFilter
              value={filter}
              isFetching={!isMetadataLoaded}
              onFilterChange={::this.onFilterChange} />
          </div>
          <DatabaseListItemMetatada
            title="Tables"
            items={filteredTables || tables}
            database={database}
            onDoubleClickItem={onDoubleClickTable}
            onSelectItem={onSelectTable} />
          <DatabaseListItemMetatada
            collapsed
            title="Views"
            items={filteredViews || views}
            database={database}
            onDoubleClickItem={onDoubleClickTable} />
          <DatabaseListItemMetatada
            collapsed
            title="Functions"
            items={filteredFunctions || functions}
            database={database} />
          <DatabaseListItemMetatada
            collapsed
            title="Procedures"
            items={filteredProcedures || procedures}
            database={database} />
        </div>
      </div>
    );
  }
}
