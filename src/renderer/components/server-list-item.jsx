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
      <div className="ui card">
        <div className="content">
          <img className="left floated mini ui image" src={ICONS[server.client]} />
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
