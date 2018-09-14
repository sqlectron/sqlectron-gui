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
import { sqlectron } from '../../browser/remote';


const CLIENTS = sqlectron.db.CLIENTS.map(dbClient => ({
  key: dbClient.key,
  name: dbClient.name,
}));


export default class ServerDBClientInfoModal extends Component {
  static propTypes = {
    client: PropTypes.string.isRequired,
    infos: PropTypes.array.isRequired,
    onCloseClick: PropTypes.func.isRequired,
  }

  componentDidMount() {
    $(this.refs.infoModal).modal({
      closable: true,
      detachable: false,
      allowMultiple: true,
      observeChanges: true,
      onHidden: () => this.props.onCloseClick(),
    }).modal('show');
  }

  componentWillUnmount() {
    $(this.refs.infoModal).modal('hide');
  }

  render() {
    const { client, infos } = this.props;
    const dbClient = CLIENTS.find(item => item.key === client);

    return (
      <div id="server-modal" className="ui modal" ref="infoModal">
        <div className="header">
          {dbClient.name} Query Information
        </div>
        <div className="content">
          <p>Some particularities about queries on {dbClient.name} you should know:</p>
          <div className="ui bulleted list">
            {infos.map((info, idx) => (<div key={idx} className="item">{info}</div>))}
          </div>
          <ul>
          </ul>
        </div>
      </div>
    );
  }
}
