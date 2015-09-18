import React, { Component, PropTypes } from 'react';
import ValidatedComponent from 'utils/validated-component.jsx'
import LoadingPage from './loading.jsx';
import List from '../widgets/list.jsx';
import { Link } from 'react-router';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/github';

const STYLES = {
  queryBox: {
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
    query: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  }

  onExecQueryClick(database) {
    const { actions } = this.props;
    const sql = React.findDOMNode(this.refs.queryBoxTextarea).value;
    actions.executeQuery(sql);
  }

  onDiscQueryClick() {
    React.findDOMNode(this.refs.queryBoxTextarea).value = '';
  }

  buildQueryResult(query) {
    if (query.error) {
      return <pre>{JSON.stringify(query.error, null, 2)}</pre>;
    }

    return (
      <table className="ui celled table">
        <thead>
          <tr>
            {Object.keys((query.rows[0] || {})).map(name => {
              return <th>{name}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {query.rows.map(row => {
            return (<tr>
              {Object.keys(row).map(name => {
                return (<td>{row[name]}</td>)
              })}
            </tr>);
          })}
        </tbody>
      </table>
    );
  }

  render() {
    const { query, actions } = this.props;
    return (
      <div>
        <div>
          <div style={STYLES.queryBox}>
            <div className="ui segment">
              <AceEditor
                mode="sql"
                theme="github"
                name="querybox"
                showGutter={false}
                height="10em"
                width="100%"
                ref="queryBoxTextarea"
                />
            </div>
            <div className="ui secondary menu" style={{marginTop:0}}>
              <div className="right menu">
                <div className="item">
                  <div className="ui buttons">
                    <button className="ui positive button" onClick={::this.onExecQueryClick}>Execute</button>
                    <div className="or"></div>
                    <button className="ui button" onClick={::this.onDiscQueryClick}>Discard</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={STYLES.resultBox}>
          {::this.buildQueryResult(query)}
        </div>
      </div>
    );
  }
};
