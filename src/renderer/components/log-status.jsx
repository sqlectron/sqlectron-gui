import React, { Component } from 'react';


const log = global.SQLECTRON_CONFIG.log;


export default class LogStatus extends Component {
  render() {
    if (!log.console && !log.file) {
      return null;
    }

    return (
      <a className="ui red label">
        <i className="terminal icon" />
        Log
        {<div className="detail">{log.level}</div>}
      </a>
    );
  }
}
