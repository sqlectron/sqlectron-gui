import React, { Component, PropTypes } from 'react';
import TableSubmenu from './table-submenu.jsx';
import { remote } from 'electron'; // eslint-disable-line import/no-unresolved

const Menu = remote.Menu;
const MenuItem = remote.MenuItem;


export default class DatabaseItem extends Component {
  static propTypes = {
    database: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    dbObjectType: PropTypes.string.isRequired,
    style: PropTypes.object,
    columnsByTable: PropTypes.object,
    triggersByTable: PropTypes.object,
    onSelectItem: PropTypes.func,
    onExecuteDefaultQuery: PropTypes.func,
    showtriggers: PropTypes.bool,
    showcolumns: PropTypes.bool,
    onGetSQLScript: PropTypes.func,
    onAdjustHeight: PropTypes.func,
    tableCollapsed: PropTypes.bool,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      height: 0,
      showcolumns: props.showcolumns,
      showtriggers: props.showtriggers,
      tableCollapsed: props.tableCollapsed,
    };
    this.contextMenu = null;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tableCollapsed !== this.state.tableCollapsed) {
      this.setState({ tableCollapsed: nextProps.tableCollapsed });
    }
    if (nextProps.showcolumns !== this.state.showcolumns) {
      this.setState({ showcolumns: nextProps.showcolumns });
    }
    if (nextProps.showtriggers !== this.state.showtriggers) {
      this.setState({ showtriggers: nextProps.showtriggers });
    }
  }

  componentDidUpdate() {
    const { onAdjustHeight, item } = this.props;
    if (onAdjustHeight) {
      onAdjustHeight({
        height: this.calculateHeight(),
        table: item.name,
        showtriggers: this.state.showtriggers,
        showcolumns: this.state.showcolumns,
        tableCollapsed: !!this.state.tableCollapsed });
    }
  }

  // Context menu is built dinamically on click (if it does not exist), because building
  // menu onComponentDidMount or onComponentWillMount slows table listing when database
  // has a loads of tables, because menu will be created (unnecessarily) for every table shown
  onContextMenu(event) {
    event.preventDefault();

    if (!this.contextMenu) {
      this.buildContextMenu();
    }

    this.contextMenu.popup(event.clientX, event.clientY);
  }

  onToggleColumns({ collapsed }) {
    this.setState({ showcolumns: !collapsed });
    this.forceUpdate();
  }

  onToggleTriggers({ collapsed }) {
    this.setState({ showtriggers: !collapsed });
    this.forceUpdate();
  }

  calculateHeight() {
    const { columnsByTable, triggersByTable, item } = this.props;
    const { tableCollapsed, showcolumns, showtriggers } = this.state;
    let tempheight = 0;
    if (tableCollapsed && showcolumns && columnsByTable && columnsByTable[item.name]) {
      tempheight = tempheight + (Math.max(columnsByTable[item.name].length, 1) * 21) + 20;
    } else if (tableCollapsed) {
      tempheight = tempheight + 28;
    }
    if (tableCollapsed && showtriggers && triggersByTable && triggersByTable[item.name]) {
      tempheight = tempheight + (Math.max(triggersByTable[item.name].length, 1) * 21) + 20;
    } else if (tableCollapsed) {
      tempheight = tempheight + 28;
    }
    return tempheight;
  }

  buildContextMenu() {
    const {
      database,
      item,
      dbObjectType,
      onExecuteDefaultQuery,
      onGetSQLScript,
    } = this.props;

    this.contextMenu = new Menu();
    if (dbObjectType === 'Table' || dbObjectType === 'View') {
      this.contextMenu.append(new MenuItem({
        label: 'Select Rows (with limit)',
        click: onExecuteDefaultQuery.bind(this, database, item),
      }));
    }

    this.contextMenu.append(new MenuItem({ type: 'separator' }));

    this.contextMenu.append(new MenuItem({
      label: 'Create Statement',
      click: onGetSQLScript.bind(this, database, item, 'CREATE', dbObjectType),
    }));

    if (dbObjectType === 'Table') {
      const actionTypes = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
      const labelsByTypes = {
        SELECT: 'Select Statement',
        INSERT: 'Insert Statement',
        UPDATE: 'Update Statement',
        DELETE: 'Delete Statement',
      };

      actionTypes.forEach(actionType => {
        this.contextMenu.append(new MenuItem({
          label: labelsByTypes[actionType],
          click: onGetSQLScript.bind(this, database, item, actionType, dbObjectType),
        }));
      });
    }
  }

  toggleTableCollapse() {
    this.setState({ tableCollapsed: !this.state.tableCollapsed });
  }

  renderSubItems(table) {
    const { columnsByTable, triggersByTable, database } = this.props;
    const { showcolumns, showtriggers } = this.state;

    if (!columnsByTable || !columnsByTable[table]) {
      return null;
    }

    const displayStyle = {};
    if (!this.state.tableCollapsed) {
      displayStyle.display = 'none';
    }

    return (
      <div style={displayStyle}>
        <TableSubmenu
          collapsed={!showcolumns}
          title="Columns"
          table={table}
          onToggle={::this.onToggleColumns}
          itemsByTable={columnsByTable}
          database={database} />
        <TableSubmenu
          collapsed={!showtriggers}
          title="Triggers"
          onToggle={::this.onToggleTriggers}
          table={table}
          itemsByTable={triggersByTable}
          database={database} />
      </div>
    );
  }

  render() {
    const { database, item, style, onSelectItem, dbObjectType } = this.props;
    const hasChildElements = !!onSelectItem;
    const onSingleClick = hasChildElements
      ? () => { onSelectItem(database, item); this.toggleTableCollapse(); }
      : () => {};

    const collapseCssClass = this.state.tableCollapsed ? 'down' : 'right';
    const collapseIcon = (
      <i
        className={`${collapseCssClass} triangle icon`}
        style={{ float: 'left', margin: '0 0.15em 0 -1em' }}
      ></i>
    );
    const tableIcon = (
      <i className="table icon" style={{ float: 'left', margin: '0 0.3em 0 0' }}></i>
    );

    return (
      <div>
        <span
          style={style}
          className="item"
          onClick={onSingleClick}
          onContextMenu={::this.onContextMenu}>
          {dbObjectType === 'Table' ? collapseIcon : null}
          {dbObjectType === 'Table' ? tableIcon : null}
          {item.name}
        </span>
        {this.renderSubItems(item.name)}
      </div>
    );
  }
}
