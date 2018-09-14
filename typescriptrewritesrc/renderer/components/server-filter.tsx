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
//import debounce from 'lodash.debounce';
import _ from 'lodash';
const debounce = _.debounce;


export default class ServerFilter extends Component {
  static propTypes = {
    onFilterChange: PropTypes.func.isRequired,
    onAddClick: PropTypes.func.isRequired,
    onSettingsClick: PropTypes.func.isRequired,
  };

  componentWillMount () {
    this.delayedCallback = debounce(this.props.onFilterChange, 200);
  }

  onFilterChange (event) {
    event.persist();
    this.delayedCallback(event);
  }

  render () {
    return (
      <div className="ui small action left icon input fluid"
        style={{ marginBottom: '1em', fontSize: '0.8em' }}>
        <i className="search icon"></i>
        <input type="text" placeholder="Search..." onChange={::this.onFilterChange} />
        <button className="ui button green" onClick={::this.props.onAddClick}>Add</button>
        <button className="ui button" onClick={::this.props.onSettingsClick}>Settings</button>
      </div>
    );
  }
}
