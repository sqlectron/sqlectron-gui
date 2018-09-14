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


export default class DatabaseFilter extends Component {
  static propTypes = {
    value: PropTypes.string,
    placeholder: PropTypes.string,
    isFetching: PropTypes.bool.isRequired,
    onFilterChange: PropTypes.func.isRequired,
  }

  onFilterChange(event) {
    this.props.onFilterChange(event.target.value);
  }

  focus() {
    this.refs.searchInput.focus();
  }

  render() {
    const { value, placeholder, isFetching } = this.props;
    return (
      <div className={`ui icon input ${isFetching ? 'loading' : ''}`}>
        <input type="text"
          placeholder={placeholder || 'Search...'}
          value={value}
          ref="searchInput"
          disabled={isFetching}
          onChange={::this.onFilterChange} />
        <i className="search icon"></i>
      </div>
    );
  }
}
