import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import {ListItem, Body, Subhead} from '../widgets/index.js';

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
export default class ConnectionListItem extends Component {

  static propTypes = {
    connection: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired, // for parent
  }

  render() {
    const {connection, onClick} = this.props;
    return <ListItem
      onClick={() => onClick(connection)}>
      <div>
        <Subhead>{connection.name}</Subhead>
        <Link to={`/${connection.name}`}>Connect</Link>
      </div>
    </ListItem>;
  }

};
