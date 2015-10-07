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

@Radium
export default class ServerListItem extends Component {

  static propTypes = {
    server: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired, // for parent
  }

  render() {
    const {server, onClick} = this.props;
    return <li
      onClick={() => onClick(server)}>
      <div>
        <h3>{server.name}</h3>
        <Link to={`/${server.name}`}>Connect</Link>
      </div>
    </li>;
  }

};
