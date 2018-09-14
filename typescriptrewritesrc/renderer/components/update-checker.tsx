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
import { ipcRenderer, shell } from 'electron'; // eslint-disable-line import/no-unresolved
import React, { Component } from 'react';


const EVENT_KEY = 'sqlectron:update-available';
const repo = global.SQLECTRON_CONFIG.repository.url.replace('https://github.com/', '');
const LATEST_RELEASE_URL = `https://github.com/${repo}/releases/latest`;


export default class UpdateChecker extends Component {
  componentDidMount() {
    ipcRenderer.on(EVENT_KEY, ::this.onUpdateAvailable);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(EVENT_KEY, ::this.onUpdateAvailable);
  }

  onUpdateAvailable() {
    this.setState({ isVisible: true });
  }

  onUpdateClick(event) {
    event.preventDefault();
    shell.openExternal(LATEST_RELEASE_URL);
  }

  render() {
    const isVisible = this.state && this.state.isVisible;
    if (!isVisible) { return null; }

    // TODO: show the latest avaible version
    // const currentVersion = `v${PACKAGE_JSON.version}`;
    // const availableVersion = '...';

    return (
      <a className="ui green label" onClick={this.onUpdateClick}>
        <i className="cloud download icon" />
        Update available
        {/* <div className="detail">{APP_VERSION}</div> */}
      </a>
    );
  }
}
