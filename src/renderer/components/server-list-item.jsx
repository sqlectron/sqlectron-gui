import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

const style = {

  date: {
    color: '#777',
    fontSize: '80%'
  },

  description: {
    color: '#444',
    fontSize: '80%'
  }

};


const ICONS = {
  mysql: 'https://www.mysql.com/common/logos/logo-mysql-170x115.png',
  postgresql: 'https://wiki.postgresql.org/images/3/30/PostgreSQL_logo.3colors.120x120.png',
};


@Radium
export default class ServerListItem extends Component {

  static propTypes = {
    server: PropTypes.object.isRequired,
    onConnectClick: PropTypes.func.isRequired, // for parent
  }

  render() {
    const {server, onConnectClick} = this.props;
    return <div className="card" onClick={() => onConnectClick(server)}>
      <div className="content">
        <img className="right floated mini ui image" src={ICONS[server.client]} style={{width: '16px'}} />
        <div className="header">
          {server.name}
        </div>
        <div className="meta">
          {server.host ? `${server.host}:${server.port}` : server.socketPath}
        </div>
      </div>
      <div className="extra content">
        <div className="ui two buttons">
          <div className="ui green button" onClick={() => onConnectClick(server)}>Connect</div>
          <div className="ui button">Edit</div>
        </div>
      </div>
    </div>;
  }

};
