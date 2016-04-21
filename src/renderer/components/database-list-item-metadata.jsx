import React, { Component, PropTypes } from 'react';

const STYLE = {
  header: { fontSize: '0.85em', color: '#636363' },
  menu: { marginLeft: '5px' },
  item: { wordBreak: 'break-all', cursor: 'default' },
};


export default class DbMetadataList extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.array,
    columnsByTable: PropTypes.object,
    collapsed: PropTypes.bool,
    database: PropTypes.object.isRequired,
    onDoubleClickItem: PropTypes.func,
    onSelectItem: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.collapsed === undefined) {
      this.setState({ collapsed: !!nextProps.collapsed });
    }
  }

  toggleCollapse() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  renderHeader() {
    const title = this.state.collapsed ? 'Expand' : 'Collapse';
    const cssClass = this.state.collapsed ? 'right' : 'down';

    return (
      <span
        title={title}
        className="header clickable"
        onClick={::this.toggleCollapse}
        style={STYLE.header}>
        <i className={`${cssClass} triangle icon`}></i>
        {this.props.title}
      </span>
    );
  }

  renderItems() {
    const { onDoubleClickItem, onSelectItem, items, database } = this.props;

    if (!items || this.state.collapsed) {
      return null;
    }

    if (!items.length) {
      return (
        <span className="ui grey item"><i> No results found</i></span>
      );
    }

    return items.map(item => {
      const isClickable = !!onDoubleClickItem;
      const hasChildElements = !!onSelectItem;
      const title = isClickable ? 'Click twice to select default query' : '';
      const onDoubleClick = isClickable
        ? onDoubleClickItem.bind(this, database, item)
        : () => {};
      const onSingleClick = hasChildElements
        ? onSelectItem.bind(this, database, item)
        : () => {};

      const cssStyle = {...STYLE.item};
      if (this.state.collapsed) {
        cssStyle.display = 'none';
      }

      return (
        <span
          key={item.name}
          title={title}
          style={cssStyle}
          className="item"
          onDoubleClick={onDoubleClick}
          onClick={onSingleClick}>
          {item.name}
          <div className="menu" style={STYLE.menu}>
            {this.renderSubItems(item.name)}
          </div>
        </span>
      );
    });
  }

  renderSubItems(table) {
    const { columnsByTable } = this.props;

    if (!columnsByTable || !columnsByTable[table]) {
      return null;
    }

    return columnsByTable[table].map(column => (
      <span
        key={column.name}
        title=""
        className="item">
        {column.name}
      </span>
    ));
  }

  render() {
    return (
      <div className="item">
        {this.renderHeader()}
        <div className="menu" style={STYLE.menu}>
          {this.renderItems()}
        </div>
      </div>
    );
  }
}
