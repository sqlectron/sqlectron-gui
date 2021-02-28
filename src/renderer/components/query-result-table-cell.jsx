import isPlainObject from 'lodash.isplainobject';
import { remote } from 'electron';
import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { valueToString } from '../utils/convert';

const { Menu, MenuItem } = remote;

export default class TableCell extends Component {
  static propTypes = {
    rowIndex: PropTypes.number.isRequired,
    data: PropTypes.any.isRequired,
    col: PropTypes.string.isRequired,
    onOpenPreviewClick: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.contextMenu = null;

    this.onContextMenu = this.onContextMenu.bind(this);
  }

  onContextMenu(event) {
    event.preventDefault();

    const value = this.getValue();

    const hasPreview = typeof value === 'string' || isPlainObject(value);

    if (!this.contextMenu && hasPreview) {
      this.contextMenu = new Menu();
      this.contextMenu.append(
        new MenuItem({
          label: 'Open Preview',
          click: () => this.props.onOpenPreviewClick(value),
        })
      );
    }

    if (this.contextMenu) {
      this.contextMenu.popup({
        x: event.clientX,
        y: event.clientY,
      });
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

    return (
      <div className="item" onContextMenu={this.onContextMenu}>
        {value === null ? <span className={className}>NULL</span> : valueToString(value)}
      </div>
    );
  }
}
