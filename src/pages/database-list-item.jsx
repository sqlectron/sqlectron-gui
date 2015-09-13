import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import ValidatedComponent from 'utils/validated-component.jsx';
import {ListItem, Body, Subhead} from '../widgets/index.js';


export default class DatabaseListItem extends ValidatedComponent {
  static propTypes = {
    database: PropTypes.object.isRequired,
    dropDatabase: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired, // for parent
  }

  render() {
    const {database, onClick} = this.props;

    return (
      <div>
        <h1>{database.name}</h1>
        <ul>
          {database.tables.map(table => <li>{table}</li>)}
        </ul>
      </div>
    );
  }

};
