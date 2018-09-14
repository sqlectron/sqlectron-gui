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
import React, { PropTypes } from 'react';

const CollapseIcon = ({ arrowDirection }) =>
  (<i
    className={`${arrowDirection} triangle icon`}
    style={{ float: 'left', margin: '0 0.15em 0 -1em' }}
  />);

CollapseIcon.propTypes = {
  arrowDirection: PropTypes.string.isRequired,
};

export default CollapseIcon;
