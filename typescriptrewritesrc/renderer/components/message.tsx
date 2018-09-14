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

export default class Message extends Component {
  static propTypes = {
    closeable: PropTypes.bool,
    type: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    preformatted: PropTypes.bool,
  }

  onClose() {
    $(this.refs.message).transition('fade');
  }

  render() {
    const { closeable, title, message, type, preformatted } = this.props;
    return (
      <div ref="message" className={`ui message ${type || ''}`}>
        {
          closeable && <i className="close icon" onClick={::this.onClose}></i>
        }
        {
          title && <div className="header">{title}</div>
        }
        {
          message && preformatted ? <pre>{message}</pre> : <p>{message}</p>
        }
      </div>
    );
  }
}
