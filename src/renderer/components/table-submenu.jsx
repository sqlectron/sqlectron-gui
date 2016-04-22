import React, { Component, PropTypes } from 'react';

const STYLE = {
  header: { fontSize: '0.85em', color: '#636363' },
  menu: { marginLeft: '5px' },
  item: { wordBreak: 'break-all', cursor: 'default' },
};


export default class TableSubmenu extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    table: PropTypes.string.isRequired,
    itemsByTable: PropTypes.object,
    collapsed: PropTypes.bool,
    database: PropTypes.object.isRequired,
    onDoubleClickItem: PropTypes.func,
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

  renderSubMenuHeader() {
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

  renderSubMenuItems(table) {
    const { itemsByTable } = this.props;

    if (!itemsByTable || !itemsByTable[table] || this.state.collapsed) {
      return null;
    }

    const cssStyle = {...STYLE.item};
    if (this.state.collapsed) {
      cssStyle.display = 'none';
    }

    return itemsByTable[table].map(item => (
      <span
        key={item.name}
        title=""
        style={cssStyle}
        className="item">
        <i className="columns icon" style={{float: 'left', margin: '0 0.3em 0 0'}}></i>
        {item.name}
        <span style={{float:'right', padding: '0 0.5em 0 0.5em', textTransform: 'uppercase'}}>{item.dataType}</span>
      </span>
    ));
  }

  render () {
    const { table } = this.props;
    return (
      <div className="item">
        {this.renderSubMenuHeader()}
        <div className="menu" style={STYLE.menu}>
          {this.renderSubMenuItems(table)}
        </div>
      </div>
    );
  }
}
