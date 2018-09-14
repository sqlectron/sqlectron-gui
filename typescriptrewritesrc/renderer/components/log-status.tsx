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
import React, { Component } from 'react';


const log = global.SQLECTRON_CONFIG.log;


export default class LogStatus extends Component {
  render() {
    if (!log.console && !log.file) {
      return null;
    }

    return (
      <a className="ui red label">
        <i className="terminal icon" />
        Log
        {<div className="detail">{log.level}</div>}
      </a>
    );
  }
}
