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

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';


export default class PreviewModal extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    onCloseClick: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentDidMount() {
    $(this.refs.previewModal).modal({
      context: 'body',
      closable: false,
      detachable: false,
      onDeny: () => {
        this.props.onCloseClick();
        return true;
      },
    }).modal('show');
  }

  componentWillUnmount() {
    $(this.refs.previewModal).modal('hide');
  }

  onClick(type) {
    this.setState({ selected: type });
  }

  getPreviewValue(type) {
    const { value } = this.props;
    try {
      switch (type) {
        case 'plain': return isPlainObject(value) ? JSON.stringify(value) : value;
        case 'json': return <pre>{JSON.stringify(value, null, 2)}</pre>;
        default: return value;
      }
    } catch (err) {
      return 'Not valid format';
    }
  }

  renderMenu() {
    const { selected } = this.state;
    const items = [
     { type: 'plain', name: 'Plain Text', default: true },
     { type: 'json', name: 'JSON' },
    ];

    return (
      <div className="ui fluid two item menu">
        {
          items.map(item => {
            const className = classNames({
              item: true,
              active: (!selected && item.default) || selected === item.type,
            });

            /* eslint react/jsx-no-bind:0 */
            return (
              <a key={item.type}
                onClick={this.onClick.bind(this, item.type)}
                className={className}>
                {item.name}
              </a>
            );
          })
        }
      </div>
    );
  }

  render() {
    const selected = this.state.selected || 'plain';
    const previewValue = this.getPreviewValue(selected);
    return (
      <div className="ui modal" ref="previewModal">
        <div className="header">
          Content Preview
        </div>
        <div className="content">
          {this.renderMenu()}
          <div className="ui segment">
            <div style={{ maxHeight: '500px', overflowY: 'scroll' }}>
              {previewValue}
            </div>
          </div>
        </div>
        <div className="actions">
          <div className="small ui black deny right button" tabIndex="0">
            Close
          </div>
        </div>
      </div>
    );
  }
}
