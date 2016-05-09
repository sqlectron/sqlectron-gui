import React, { Component, PropTypes } from 'react';
import TableSubmenu from './table-submenu.jsx';


const STYLE = {
  item: { wordBreak: 'break-all', cursor: 'default' },
};


export default class DatabaseItem extends Component {
  static propTypes = {
    database: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    dbObjectType: PropTypes.string.isRequired,
    title: PropTypes.string,
    style: PropTypes.object,
    columnsByTable: PropTypes.object,
    triggersByTable: PropTypes.object,
    onSelectItem: PropTypes.func,
    onDoubleClick: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
    //this.contextMenu;
  }

  toggleTableCollapse() {
    this.setState({ tableCollapsed: !this.state.tableCollapsed });
  }

  renderSubItems(table) {
    const { columnsByTable, triggersByTable, database } = this.props;

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
          title="Columns"
          table={table}
          itemsByTable={columnsByTable}
          database={database}/>
        <TableSubmenu
          collapsed
          title="Triggers"
          table={table}
          itemsByTable={triggersByTable}
          database={database}/>
      </div>
    );
  }

  render() {
    const { database, item, title, style, onDoubleClick, onSelectItem, dbObjectType } = this.props;
    const hasChildElements = !!onSelectItem;
    const onSingleClick = hasChildElements
      ? () => {onSelectItem(database, item); this.toggleTableCollapse();}
      : () => {};

    const collapseCssClass = this.state.tableCollapsed ? 'down' : 'right';
    const collapseIcon = (
      <i className={`${collapseCssClass} triangle icon`} style={{float: 'left', margin: '0 0.15em 0 -1em'}}></i>
    );
    const tableIcon = (
      <i className="table icon" style={{float: 'left', margin: '0 0.3em 0 0'}}></i>
    );

    return (
      <div>
        <span
          title={title}
          style={style}
          className="item"
          onClick={onSingleClick}
          onDoubleClick={onDoubleClick}>
          { dbObjectType === 'Tables' ? collapseIcon : null }
          { dbObjectType === 'Tables' ? tableIcon : null }
          {item.name}
        </span>
        {this.renderSubItems(item.name)}
      </div>
    );
  }
}
