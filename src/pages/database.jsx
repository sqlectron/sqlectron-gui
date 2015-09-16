import React, { Component, PropTypes } from 'react';
import ValidatedComponent from 'utils/validated-component.jsx'
import LoadingPage from './loading.jsx';
import List from '../widgets/list.jsx';
import { Link } from 'react-router';

const STYLES = {
  queryBox: {
  },
  queryBoxTextarea: {
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

  onDiscQueryClick() {
    React.findDOMNode(this.refs.queryBoxTextarea).value = '';
  }

  buildQueryResult(queryResult) {
    if (queryResult.error) {
      return <pre>{JSON.stringify(queryResult.error, null, 2)}</pre>;
    }

    return (
      <table className="ui celled table">
        <thead>
          <tr>
            {Object.keys((queryResult.rows[0] || {})).map(name => {
              return <th>{name}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {queryResult.rows.map(row => {
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
    const { queryResult, actions } = this.props;
    return (
      <div>
        <div>
          <div style={STYLES.queryBox}>
            <div className="ui form">
              <div className="field">
                <textarea ref="queryBoxTextarea" style={STYLES.queryBoxTextarea}></textarea>
              </div>
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
          {::this.buildQueryResult(queryResult)}
        </div>
      </div>
    );
  }
};
