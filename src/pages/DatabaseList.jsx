import React, {Component, PropTypes} from 'react';
import ValidatedComponent from 'utils/ValidatedComponent.jsx';

// widgets
import List from '../widgets/List.jsx';
import DatabaseListItem from './DatabaseListItem.jsx';
import LoadingPage from './LoadingPage.jsx';

import {Dialog} from 'material-ui';


export default class DatabaseList extends ValidatedComponent {

  constructor(props) {
    super(props);
    this.state = {
      dropDB: {}
    }
  }

  static propTypes = {
    databases: PropTypes.array.isRequired,
    loadDatabases: PropTypes.func.isRequired,
    dropDatabase: PropTypes.func.isRequired,

  }

  componentDidMount() {
    this.props.loadDatabases();
  }

  render() {
    const {databases, dropDatabase} = this.props;
    console.info('[DatabaseList.jsx databases] ', this.props);
    const standardActions = [
      { text: 'Cancel' },
      { text: 'Drop Database', onClick: this.onDialogSubmit, ref: 'submit' }
    ];
    const {dropDB} = this.state;

    return databases.length > 0 ?
      <List>

        <Dialog
          title={`Drop Database`}
          ref='dialog'
          actions={standardActions}
          actionFocus="submit"
          modal={true}>
          {`Do you want to drop database ${dropDB.Name}?`}
        </Dialog>

        {databases.map((database,i) =>
          <DatabaseListItem
            onClick={::this.onItemClick}
            key={i}
            {...{dropDatabase, database}} />
        )}
      </List>
    : <LoadingPage />;
  }

  onItemClick(database) {
    this.setState({dropDB: database});
    this.refs.dialog.show();
  }


};
