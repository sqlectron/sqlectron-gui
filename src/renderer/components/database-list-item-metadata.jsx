import React, { Component, PropTypes } from 'react';


export default class DbMetadataList extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.array,
    collapsed: PropTypes.bool,
    database: PropTypes.object.isRequired,
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

  renderItems() {
    const { onSelectItem, items, database } = this.props;

    if (!items || this.state.collapsed) {
      return null;
    }

    if (!items.length) {
      return (
        <span className="ui grey item"><i> No results found</i></span>
      );
    }

    return items.map(item => {
      const isClickable = !!onSelectItem;
      const onDoubleClick = isClickable
        ? onSelectItem.bind(this, database, item)
        : () => {};

      const cssStyle = {};
      if (this.state.collapsed) {
        cssStyle.display = 'none';
      }
      return (
        <span
          key={item.name}
          style={cssStyle}
          className="item"
          onDoubleClick={onDoubleClick}>
          {item.name}
        </span>
      );
    });
  }

  render() {
    return (
      <div className="item">
        <span className="header clickable" onClick={::this.toggleCollapse} style={{fontSize: '0.9em'}}>
          {this.props.title}
        </span>
        <div className="menu">
          {this.renderItems()}
        </div>
      </div>
    );
  }
}

