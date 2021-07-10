import React from 'react';
import PropTypes from 'prop-types';
import { sqlectron } from '../api';
import UpdateChecker from './update-checker';
import LogStatus from './log-status';

const STYLE = {
  footer: { minHeight: 'auto' },
  status: { paddingLeft: '0.5em' },
};

function onGithubClick(event) {
  event.preventDefault();
  sqlectron.browser.shell.openExternal('https://github.com/sqlectron/sqlectron-gui');
}

function onShortcutsClick(event) {
  event.preventDefault();
  sqlectron.browser.shell.openExternal(
    'https://github.com/sqlectron/sqlectron-gui/wiki/Keyboard-Shortcuts',
  );
}

const Footer = ({ status }) => (
  <div className="ui bottom fixed menu borderless" style={STYLE.footer}>
    <div style={STYLE.status}>{status}</div>
    <div className="right menu">
      <div className="item">
        <LogStatus />
        <UpdateChecker />
      </div>
      <a href="#" className="item" onClick={onGithubClick}>
        GitHub
      </a>
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
