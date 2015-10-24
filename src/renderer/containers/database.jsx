import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Query from '../components/query.jsx';
import { executeQueryIfNeeded, updateQuery } from '../actions/queries';


export default class DatabaseContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,

    params: PropTypes.object.isRequired,

    tables: PropTypes.any,
    queries: PropTypes.any,
  };

  static contextTypes = {
    history: PropTypes.object.isRequired,
  };

  componentWillMount () {
    this.handleEvents(this.props);
  }

  componentDidMount () {
    // this.refs.tableList.focus();
  }

  componentWillReceiveProps (nextProps) {
    this.handleEvents(nextProps);
  }

  onSQLChange (sqlQuery) {
    this.props.dispatch(updateQuery(sqlQuery));
  }

  handleEvents (/* { tables, query } */) {
    // const { dispatch } = this.props;
    //
    // if (tables.error) return dispatch(setStatus(tables.error));
    // if (tables.isFetching) return dispatch(setStatus('Loading list of tables...'));
    // if (query.isExecuting) return dispatch(setStatus('Executing query...'));
    // if (query.error) return dispatch(setStatus(query.error));
    //
    // dispatch(clearStatus());
  }

  handleExecuteQuery (sqlQuery) {
    this.props.dispatch(executeQueryIfNeeded(sqlQuery));
  }

  handleSelectTable () {
    const { tables } = this.props;
    if (!tables.items.length) return;

    const selected = this.refs.tableList.selected();
    const item = tables.items[selected];
    const query = `select * from "${item}" limit 1000`;
    this.props.dispatch(executeQueryIfNeeded(query));
  }

  handleChangeDatabase () {
    const { id, database } = this.props.params;
    const route = `/server/${id}/database/${database}/databases`;
    this.context.history.pushState(null, route);
  }

  handleClearQuery () {
    this.refs.queryArea.setValue('');
  }

  render() {
    const { queries } = this.props;

    return (
      <Query query={queries}
        onExecQueryClick={::this.handleExecuteQuery}
        onSQLChange={::this.onSQLChange} />
    );
  }
}


function mapStateToProps (state) {
  return {
    tables: state.tables,
    queries: state.queries,
  };
}


export default connect(mapStateToProps)(DatabaseContainer);
