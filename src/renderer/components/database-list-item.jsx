import React, { Component, PropTypes } from 'react';
import DatabaseListItemMetatada from './database-list-item-metadata.jsx';


const STYLE = {
  database: {
    cursor: 'pointer',
    wordBreak: 'break-all',
  },
  collapse: {
    cursor: 'pointer',
  },
};


export default class DatabaseListItem extends Component {
  static propTypes = {
    tables: PropTypes.array,
    views: PropTypes.array,
    functions: PropTypes.array,
    procedures: PropTypes.array,
    database: PropTypes.object.isRequired,
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

  renderCollapseButton() {
    if (!this.isMetadataLoaded()) {
      return null;
    }

    const title = this.state.collapsed ? 'Expand' : 'Collapse';
    const cssClass = this.state.collapsed ? 'plus' : 'minus';

    return (
      <i className={`${cssClass} square outline icon`}
        style={STYLE.collapse}
        title={title}
        onClick={::this.toggleCollapse} />
    );
  }

  render() {
    const { tables, views, functions, procedures, database, onSelectTable, onSelectDatabase } = this.props;

    const cssStyleItems = {};
    if (this.state.collapsed || !this.isMetadataLoaded()) {
      cssStyleItems.display = 'none';
    }

    return (
      <div className="item" style={{padding: 0}}>
        <div className="item">
          <i className="grid database icon"></i>
          {this.renderCollapseButton()}
          <span style={STYLE.database}
            onDoubleClick={() => onSelectDatabase(database)}>
            {database.name}
          </span>
          <div className="menu" style={cssStyleItems}>
            <DatabaseListItemMetatada
              title="Tables"
              items={tables}
              database={database}
              onSelectItem={onSelectTable} />
            <DatabaseListItemMetatada
              collapsed
              title="Views"
              items={views}
              database={database}
              onSelectItem={onSelectTable} />
            <DatabaseListItemMetatada
              collapsed
              title="Functions"
              items={functions}
              database={database} />
            <DatabaseListItemMetatada
              collapsed
              title="Procedures"
              items={procedures}
              database={database} />
          </div>
        </div>
      </div>
    );
  }
}
