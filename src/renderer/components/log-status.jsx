import React from 'react';

const log = window.SQLECTRON_CONFIG.log;

const LogStatus = () => {
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

LogStatus.displayName = 'LogStatus';

export default LogStatus;
