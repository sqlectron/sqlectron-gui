import {Dialog} from 'material-ui';
import React, { Component, PropTypes } from 'react';
import ValidatedComponent from 'utils/ValidatedComponent.jsx';
import DatabaseListItem from './DatabaseListItem.jsx';
import LoadingPage from './LoadingPage.jsx';
import List from '../widgets/List.jsx';


export default class DatabaseList extends ValidatedComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      databaseToDrop: {}
    }
  }

  static propTypes = {
    databases: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.loadDatabases();
  }

  onItemClick(database) {
    this.setState({ databaseToDrop: database });
    this.refs.dialog.show();
  }

  onItemCancel() {
    this.setState({ databaseToDrop: {} });
    this.refs.dialog.dismiss();
  }

  render() {
    const { databases, actions } = this.props;
    console.info('[DatabaseList.jsx databases] ', this.props);
    const standardActions = [
      { text: 'Cancel', onClick: ::this.onItemCancel },
      { text: 'Drop Database', onClick: this.onDialogSubmit, ref: 'submit' }
    ];
    const { databaseToDrop } = this.state;

    return databases.length > 0 ?
      <List>

        <Dialog
          title={`Drop Database`}
          ref='dialog'
          actions={standardActions}
          actionFocus="submit"
          modal={true}>
          {`Do you want to drop database ${databaseToDrop.Name}?`}
        </Dialog>

        {databases.map((database,i) =>
          <DatabaseListItem
            onClick={::this.onItemClick}
            key={i}
            dropDatabase={actions.dropDatabase}
            database={database} />
        )}
      </List>
    : <LoadingPage />;
  }
};
