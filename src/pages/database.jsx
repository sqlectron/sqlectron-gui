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
  }

  static propTypes = {
    queryResult: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  }

  onExecQueryClick(database) {
    const { actions } = this.props;
    const sql = React.findDOMNode(this.refs.queryBoxTextarea).value;
    actions.query(sql);
  }

  render() {
    const { queryResult, actions } = this.props;
    return (
      <div>
        <div>
          <div style={STYLES.queryBox}>
            <textarea ref="queryBoxTextarea" style={STYLES.queryBoxTextarea} />
            <input type="button" value="Execute Query" onClick={::this.onExecQueryClick} />
          </div>
        </div>
        <div style={STYLES.resultBox}>
          {queryResult && queryResult.rows && queryResult.rows.length ? (
            <table>
              {queryResult.rows.map(row => {
                return (<tr>
                  {Object.keys(row).map(name => {
                    return (<td>{row[name]}</td>)
                  })}
                </tr>);
              })}
            </table>
          ) : '-- result --' }

        </div>
      </div>
    );
  }
};
