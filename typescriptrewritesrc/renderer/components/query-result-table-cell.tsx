/**
 * unified-dataloader-gui
 * Copyright (C) 2018 Armarti Industries
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
//import isPlainObject from 'lodash.isplainobject';
import _ from 'lodash';
const isPlainObject = _.isPlainObject;

import { remote } from 'electron'; // eslint-disable-line import/no-unresolved
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

    return (
      <div className="item" onContextMenu={::this.onContextMenu}>
        {
          value === null
            ? <span className={className}>NULL</span>
            : valueToString(value)
        }
      </div>
    );
  }
}
