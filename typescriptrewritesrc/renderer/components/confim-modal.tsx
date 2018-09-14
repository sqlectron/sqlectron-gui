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
import React, { Component, PropTypes } from 'react';


export default class ServerModalForm extends Component {
  static propTypes = {
    onCancelClick: PropTypes.func.isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    context: PropTypes.string.isRequired,
  }

  componentDidMount() {
    $(this.refs.confirmModal).modal({
      closable: false,
      detachable: false,
      allowMultiple: true,
      context: this.props.context,
      onDeny: () => {
        this.props.onCancelClick();
        return true;
      },
      onApprove: () => {
        this.props.onRemoveClick();
        return false;
      },
    }).modal('show');
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ error: nextProps.error });
  }

  componentWillUnmount() {
    $(this.refs.confirmModal).modal('hide');
  }

  render() {
    const { title, message } = this.props;

    return (
      <div className="ui modal" ref="confirmModal" style={{ position: 'absolute' }}>
        <div className="header">
          {title}
        </div>
        <div className="content">
          {message}
        </div>
        <div className="actions">
          <div className="small ui black deny right labeled icon button" tabIndex="0">
            No
            <i className="ban icon"></i>
          </div>
          <div className="small ui positive right labeled icon button" tabIndex="0">
            Yes
            <i className="checkmark icon"></i>
          </div>
        </div>
      </div>
    );
  }
}
