import { isPlainObject } from 'lodash';
import { remote } from 'electron';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { valueToString } from '../utils/convert';

const { Menu, MenuItem } = remote;

export default class TableCell extends Component {
  static propTypes = {
    rowIndex: PropTypes.number.isRequired,
    data: PropTypes.any.isRequired,
    col: PropTypes.string.isRequired,
    onOpenPreviewClick: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.contextMenu = null;
  }

  onContextMenu(event) {
    event.preventDefault();

    const value = this.getValue();

    const hasPreview = (
      typeof value === 'string'
      || isPlainObject(value)
    );

    if (!this.contextMenu && hasPreview) {
      this.contextMenu = new Menu();
      this.contextMenu.append(new MenuItem({
        label: 'Open Preview',
        click: () => this.props.onOpenPreviewClick(value),
      }));
    }

    if (this.contextMenu) {
      this.contextMenu.popup(event.clientX, event.clientY);
    }
  }

  getValue() {
    const { rowIndex, data, col } = this.props;
    return data[rowIndex][col];
  }

  render() {

    const value = this.getValue();
  
    const className = classNames({
      'ui mini grey label table-cell-type-null': value === null,
    });

    return (<div className="item" onContextMenu={::this.onContextMenu}>
          {value===null?<span className={className}>NULL</span>:valueToString(value)}
        </div>);

  }
}
