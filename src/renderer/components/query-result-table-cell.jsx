import isPlainObject from 'lodash/isPlainObject';
import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { valueToString } from '../utils/convert';
import * as eventKeys from '../../common/event';
import ContextMenu from '../utils/context-menu';

const MENU_CTX_ID = 'CONTEXT_MENU_TABLE_CELL';

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
  componentWillUnmount() {
    if (this.contextMenu) {
      this.contextMenu.dispose();
      this.contextMenu = null;
    }
  }

  onContextMenu(event) {
    event.preventDefault();

    const value = this.getValue();

    const hasPreview = typeof value === 'string' || isPlainObject(value);

    if (!this.contextMenu && hasPreview) {
      this.contextMenu = new ContextMenu(MENU_CTX_ID);

      this.contextMenu.append({
        label: 'Open Preview',
        event: eventKeys.BROWSER_MENU_OPEN_PREVIEW,
        click: () => this.props.onOpenPreviewClick(value),
      });

      this.contextMenu.build();
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
