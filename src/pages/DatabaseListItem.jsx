import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import ValidatedComponent from 'utils/ValidatedComponent.jsx';

import {Checkbox, Dialog} from 'material-ui';

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

@Radium.Enhancer
export default class DatabaseListItem extends ValidatedComponent {

  static propTypes = {
    database: PropTypes.object.isRequired,
    dropDatabase: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired, // for parent
  }

  render() {
    const {database, onClick} = this.props;
    const dateInstalledRelative = database['Install Date'].fromNow();


    return <ListItem
      onClick={() => onClick(database)}>


      <div>
        <Subhead>{database['Name']}</Subhead>
        <Body secondary>
          {' '}({dateInstalledRelative})
        </Body>
      </div>

      <Body secondary>
       {' '} {database['Description']}
      </Body>
    </ListItem>;
  }

};
