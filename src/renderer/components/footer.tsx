import React, { FC, MouseEvent } from 'react';

import { sqlectron } from '../api';
import UpdateChecker from './update-checker';
import LogStatus from './log-status';

interface Props {
  status: string;
}

const Footer: FC<Props> = ({ status }) => {
  const onGithubClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    sqlectron.browser.shell.openExternal('https://github.com/sqlectron/sqlectron-gui');
  };

  const onShortcutsClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    sqlectron.browser.shell.openExternal(
      'https://github.com/sqlectron/sqlectron-gui/wiki/Keyboard-Shortcuts',
    );
  };

  return (
    <div className="ui bottom fixed menu borderless" style={{ minHeight: 'auto' }}>
      <div style={{ paddingLeft: '0.5em' }}>{status}</div>
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
};

Footer.displayName = 'Footer';

export default Footer;
