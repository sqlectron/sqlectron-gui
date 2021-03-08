import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CollapseIcon from './collapse-icon';
import TableSubmenu from './table-submenu';
import { sqlectron } from '../api';

export default class DatabaseItem extends Component {
  static propTypes = {
    client: PropTypes.string.isRequired,
    database: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    dbObjectType: PropTypes.string.isRequired,
    style: PropTypes.object,
    columnsByTable: PropTypes.object,
    triggersByTable: PropTypes.object,
    indexesByTable: PropTypes.object,
    onSelectItem: PropTypes.func,
    onExecuteDefaultQuery: PropTypes.func,
    onGetSQLScript: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.isContextMenuConfigured = false;

    this.onContextMenu = this.onContextMenu.bind(this);
    this.onSingleClick = this.onSingleClick.bind(this);
  }

  onSingleClick() {
    const { onExecuteDefaultQuery, database, item } = this.props;
    onExecuteDefaultQuery(database, item);
  }

  // Context menu is built dynamically on click (if it does not exist), because building
  // menu onComponentDidMount or onComponentWillMount slows table listing when database
  // has a loads of tables, because menu will be created (unnecessarily) for every shown table
  onContextMenu(event) {
    event.preventDefault();

    if (!this.isContextMenuConfigured) {
      this.buildContextMenu();
    }

    sqlectron.browser.menu.popupContextMenuDatabaseItem({
      x: event.clientX,
      y: event.clientY,
    });
  }

  buildContextMenu() {
    const {
      client,
      database,
      item,
      dbObjectType,
      onExecuteDefaultQuery,
      onGetSQLScript,
    } = this.props;

    this.isContextMenuConfigured = true;
    sqlectron.browser.menu.buildContextMenuDatabaseItem({
      client,
      database,
      item,
      dbObjectType,
      onExecuteDefaultQuery,
      onGetSQLScript,
    });
  }

  toggleTableCollapse() {
    this.setState({ tableCollapsed: !this.state.tableCollapsed });
  }

  renderSubItems({ schema, name }) {
    const { columnsByTable, triggersByTable, indexesByTable, database } = this.props;

    if (!columnsByTable || !columnsByTable[name]) {
      return null;
    }

    const displayStyle = {};
    if (!this.state.tableCollapsed) {
      displayStyle.display = 'none';
    }

    return (
      <div style={displayStyle}>
        <TableSubmenu
          title="Columns"
          schema={schema}
          table={name}
          itemsByTable={columnsByTable}
          database={database}
        />
        <TableSubmenu
          collapsed
          title="Triggers"
          schema={schema}
          table={name}
          itemsByTable={triggersByTable}
          database={database}
        />
        <TableSubmenu
          collapsed
          title="Indexes"
          schema={schema}
          table={name}
          itemsByTable={indexesByTable}
          database={database}
        />
      </div>
    );
  }

  render() {
    const { database, item, style, onSelectItem, dbObjectType } = this.props;
    const hasChildElements = !!onSelectItem;
    const expandChildren = hasChildElements
      ? () => {
          onSelectItem(database, item);
          this.toggleTableCollapse();
        }
      : () => {};

    const collapseArrowDirection = this.state.tableCollapsed ? 'down' : 'right';
    const tableIcon = <i className="table icon" style={{ float: 'left', margin: '0 0.3em 0 0' }} />;

    const { schema, name } = item;
    const fullName = schema ? `${schema}.${name}` : name;

    return (
      <div>
        <span
          style={style}
          className={`item item-${dbObjectType}`}
          onContextMenu={this.onContextMenu}>
          {dbObjectType === 'Table' ? (
            <CollapseIcon arrowDirection={collapseArrowDirection} expandAction={expandChildren} />
          ) : null}
          {dbObjectType === 'Table' ? tableIcon : null}
          <span onClick={this.onSingleClick}>{fullName}</span>
        </span>
        {this.renderSubItems(item)}
      </div>
    );
  }
}
