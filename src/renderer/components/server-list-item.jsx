import React, { Component, PropTypes } from 'react';


const ICONS = {
  mysql: 'https://www.mysql.com/common/logos/logo-mysql-170x115.png',
  postgresql: 'https://wiki.postgresql.org/images/3/30/PostgreSQL_logo.3colors.120x120.png',
};


export default class ServerListItem extends Component {
  static propTypes = {
    server: PropTypes.object.isRequired,
    onConnectClick: PropTypes.func.isRequired,
    onEditClick: PropTypes.func.isRequired,
  }

  render() {
    const {server, onConnectClick, onEditClick} = this.props;
    return (
      <div className="card">
        <div className="content">
          <div className="left floated" style={{height: '35px', width: '35px', margin: '5px 10px 0 0'}}>
            <img className="ui image" style={{width: '100%'}} src={ICONS[server.client]} />
          </div>
          <button className="right floated circular ui icon button mini"
            onClick={() => onEditClick(server)}>
            <i className="icon pencil"></i>
          </button>
          <div className="header">
            {server.name}
          </div>
          <div className="meta">
            {server.host ? `${server.host}:${server.port}` : server.socketPath}
          </div>
        </div>
        <div className="ui bottom attached button"
          tabIndex="0"
          onClick={() => onConnectClick(server)}>
          <i className="plug icon"></i>
          Connect
        </div>
      </div>
    );
  }
}
