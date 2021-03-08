import isPlainObject from 'lodash.isplainobject';
import { sqlectron } from '../api';
import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { valueToString } from '../utils/convert';

export default class TableCell extends Component {
  static propTypes = {
    rowIndex: PropTypes.number.isRequired,
    data: PropTypes.any.isRequired,
    col: PropTypes.string.isRequired,
    onOpenPreviewClick: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.isContextMenuConfigured = false;

    this.onContextMenu = this.onContextMenu.bind(this);
  }

  onContextMenu(event) {
    event.preventDefault();

    const value = this.getValue();

    const hasPreview = typeof value === 'string' || isPlainObject(value);

    if (!this.isContextMenuConfigured && hasPreview) {
      this.isContextMenuConfigured = true;
      sqlectron.browser.menu.buildContextMenuTableCell();
      sqlectron.browser.menu.onPreviewTableCell(() => this.props.onOpenPreviewClick(value));
    }

    if (this.isContextMenuConfigured) {
      sqlectron.browser.menu.popupContextMenuTableCell(event.clientX, event.clientY);
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
