import React, { FC } from 'react';
import { CONFIG } from '../api';

const log = CONFIG.log;

const LogStatus: FC = () => {
  if (!log.console && !log.file) {
    return null;
  }

  return (
    <a className="ui red label" style={{ cursor: 'default' }}>
      <i className="terminal icon" />
      Log
      <div className="detail">{log.level}</div>
    </a>
  );
};

export default LogStatus;
