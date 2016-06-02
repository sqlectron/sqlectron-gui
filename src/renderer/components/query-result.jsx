import React, { Component, PropTypes } from 'react';
import Loader from './loader.jsx';
import Message from './message.jsx';
import QueryResultTable from './query-result-table.jsx';
import QueryResultTableVirtualized from './query-result-table-virtualized.jsx';

export default class QueryResult extends Component {
  static propTypes = {
    widthOffset: PropTypes.number.isRequired,
    heigthOffset: PropTypes.number.isRequired,
    onCopyToClipboardClick: PropTypes.func.isRequired,
    resultItemsPerPage: PropTypes.number.isRequired,
    copied: PropTypes.bool,
    query: PropTypes.string,
    results: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        fields: PropTypes.array,
        rows: PropTypes.array,
        rowCount: React.PropTypes.number,
        affectedRows: React.PropTypes.number,
      }),
    ),
    isExecuting: PropTypes.bool,
    error: PropTypes.object,
  }

  shouldComponentUpdate(nextProps) {
    return (
      (!nextProps.isExecuting && this.props.isExecuting) ||
      (nextProps.query !== this.props.query) ||
      (nextProps.copied && !this.props.copied)
    );
  }

  componentWillUpdate(nextProps) {
    const renderingResults = !nextProps.isExecuting && this.props.isExecuting;
    if (renderingResults && this.refs.loader) {
      const loader = this.refs.loader.getElementsByClassName('text loader')[0];
      loader.innerText = 'Rendering result';
    }
  }

  renderQueryResult({ fields, rows, rowCount, affectedRows, queryIndex, totalQueries, command, isMultipleResults }) {
    if (command !== 'SELECT') {
      const msgAffectedRows = affectedRows ? `Affected rows: ${affectedRows}.` : '';
      return (
        <Message
          key={queryIndex}
          message={`Query executed successfully. ${msgAffectedRows}`}
          type="success" />
      );
    }

    let widthOffset = this.props.widthOffset;
    if (isMultipleResults) {
      widthOffset += 30; // padding of the query result box
    }
    
    const tableResult = (
      <QueryResultTableVirtualized
        key={queryIndex}
        widthOffset={widthOffset}
        heigthOffset={this.props.heigthOffset}
        resultItemsPerPage={this.props.resultItemsPerPage}
        copied={this.props.copied}
        fields={fields}
        rows={rows}
        rowCount={rowCount}
        onCopyToClipboardClick={this.props.onCopyToClipboardClick} />
    );

    if (totalQueries === 1) {
      return tableResult;
    }

    return (
      <div key={queryIndex} className="ui segment">
        <div className="ui top left attached label">
          Query {queryIndex + 1}
        </div>
        {tableResult}
      </div>
    );
  }

  render() {
    const { isExecuting, error, results } = this.props;
    if (error) {
      if (error.message) {
        return <div className="ui negative message">{error.message}</div>;
      }
      return <pre>{JSON.stringify(error, null, 2)}</pre>;
    }

    if (isExecuting) {
      return (
        <div ref="loader" style={{minHeight: '250px'}}>
          <Loader message="Loading" type="active" inverted />
        </div>
      );
    }

    if (!results) {
      return null;
    }

    const totalQueries = results.length;
    return (
      <div id="query-result">
        {
          results.map((result, idx) => this.renderQueryResult({
            ...result,
            totalQueries,
            queryIndex: idx,
            isMultipleResults: results.length > 1,
          }))
        }
      </div>
    );
  }
}
