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
import UpdateChecker from './update-checker.jsx';
import LogStatus from './log-status.jsx';


const STYLE = {
  footer: { minHeight: 'auto' },
  status: { paddingLeft: '0.5em' },
};


function onGithubClick(event) {
  event.preventDefault();
  shell.openExternal('https://github.com/armarti/unified-dataloader-gui');
}

function onShortcutsClick(event) {
  event.preventDefault();
  shell.openExternal('https://github.com/armarti/unified-dataloader-gui/wiki/Keyboard-Shortcuts');
}


const Footer = ({ status }) => (
  <div className="ui bottom fixed menu borderless" style={STYLE.footer}>
    <div style={STYLE.status}>{status}</div>
    <div className="right menu">
      <div className="item">
        <LogStatus />
        <UpdateChecker />
      </div>
      <a href="#" className="item" onClick={onGithubClick}>Github</a>
      <a href="#" className="item" title="Keyboard Shortcuts" onClick={onShortcutsClick}>
        <i className="keyboard icon" />
      </a>
    </div>
  </div>
);


Footer.propTypes = {
  status: PropTypes.string.isRequired,
};


export default Footer;
