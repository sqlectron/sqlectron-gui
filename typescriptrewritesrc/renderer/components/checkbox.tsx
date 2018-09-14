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

export default class Checkbox extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    onChecked: PropTypes.func.isRequired,
    onUnchecked: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { onChecked, onUnchecked } = this.props;

    $(this.refs.checkbox).checkbox({ onChecked, onUnchecked });
  }

  render () {
    const { name, label, disabled, defaultChecked } = this.props;
    return (
      <div className="ui toggle checkbox" ref="checkbox">
        <input type="checkbox"
          name={name}
          disabled={disabled}
          defaultChecked={defaultChecked} />
        <label>{label}</label>
      </div>
    );
  }
}
