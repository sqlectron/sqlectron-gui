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
import { shell } from 'electron'; // eslint-disable-line import/no-unresolved

require('./header.css');

const LOGO_PATH = require('./logo-128px.png');


function onSiteClick(event) {
  event.preventDefault();
  shell.openExternal('https://unified-dataloader.github.io');
}


function renderBreadcrumb(items) {
  return (
    <div className="ui breadcrumb" style={{ margin: '0 auto' }}>
      {items.map(({ icon, label }, index) => {
        const isLast = (index !== items.length - 1);
        return (
          <span key={index + label}>
            <i className={`${icon} icon`}></i>
            <a className={`section ${isLast ? 'active' : ''}`}>
              {label}
            </a>
            {isLast && <div className="divider"> / </div>}
          </span>
        );
      })}
    </div>
  );
}


const Header = ({ items, onCloseConnectionClick, onReConnectionClick }) => {
  const visibilityButtons = onCloseConnectionClick ? 'visible' : 'hidden';
  const styleItem = { paddingLeft: 0, paddingTop: 0, paddingBottom: 0 };
  return (
    <div id="header" className="ui top fixed menu borderless">
      <a href="#" className="item" onClick={onSiteClick}>
        <img alt="logo" src={LOGO_PATH} style={{ width: '5.5em' }} />
      </a>
      <div style={{ margin: '0 auto' }}>
        <div className="item" style={{ marginLeft: '-109px', marginRight: '-94px' }}>
          {renderBreadcrumb(items)}
        </div>
      </div>
      <div className="right menu" style={{ visibility: visibilityButtons }}>
        <div className="item borderless" style={styleItem}>
          <div className="ui mini basic icon buttons">
            <button className="ui button"
              title="Reconnect"
              onClick={onReConnectionClick}>
              <i className="plug icon"></i>
            </button>
            <button className="ui icon button"
              title="Close connection"
              onClick={onCloseConnectionClick}>
              <i className="power icon"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


Header.propTypes = {
  items: PropTypes.array.isRequired,
  onCloseConnectionClick: PropTypes.func,
  onReConnectionClick: PropTypes.func,
};


export default Header;
