// import {Dialog} from 'material-ui';
import React, { Component, PropTypes } from 'react';
import ValidatedComponent from 'utils/validated-component.jsx'
import DatabaseListItem from './database-list-item.jsx';
import LoadingPage from './loading.jsx';
import List from '../widgets/list.jsx';
import { Link } from 'react-router';

const STYLES = {
  queryBox: {
  },
  queryBoxTextarea: {
    width: '100%',
    minHeight: '200px'
  },
  resultBox: {
    background: '#ececec'
  }
}

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
    const standardActions = [
      { text: 'Cancel', onClick: ::this.onItemCancel },
      { text: 'Drop Database', onClick: this.onDialogSubmit, ref: 'submit' }
    ];
    const { databaseToDrop } = this.state;

    return (
      <div>
        <div>
          <div style={STYLES.queryBox}>
            <textarea  style={STYLES.queryBoxTextarea} />
            <input type="button" value="Execute Query" />
          </div>
        </div>
        <div style={STYLES.resultBox}>
          -- result --
        </div>
      </div>
    );
  }
};
