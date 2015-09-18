import React, {Component, PropTypes} from 'react';


export default class DatabaseListItem extends Component {
  static propTypes = {
    database: PropTypes.object.isRequired,
    dropDatabase: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired, // for parent
  }

  render() {
    const {database, onClick} = this.props;

    return (
      <div>
        <h1 style={{fontSize: '1em'}}>{database.name}</h1>
        <ul style={{fontSize: '0.7em', marginLeft: '10px'}}>
          {database.tables.map(table => <li>{table}</li>)}
        </ul>
      </div>
    );
  }

};
