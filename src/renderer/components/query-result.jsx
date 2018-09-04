import groupBy from 'lodash.groupby';
import React, { Component, PropTypes } from 'react';
import Loader from './loader.jsx';
import Message from './message.jsx';
import QueryResultTable from './query-result-table.jsx';

export default class QueryResult extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    widthOffset: PropTypes.number.isRequired,
    heigthOffset: PropTypes.number.isRequired,
    onCopyToClipboardClick: PropTypes.func.isRequired,
    onSaveToFileClick: PropTypes.func.isRequired,
    resultItemsPerPage: PropTypes.number.isRequired,
    copied: PropTypes.bool,
    saved: PropTypes.bool,
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
      (nextProps.copied && !this.props.copied) ||
      (nextProps.widthOffset !== this.props.widthOffset)
    );
  }

  componentWillUpdate(nextProps) {
    const renderingResults = !nextProps.isExecuting && this.props.isExecuting;
    if (renderingResults && this.refs.loader) {
      const loader = this.refs.loader.getElementsByClassName('text loader')[0];
      loader.innerText = 'Rendering result';
    }
  }

  renderQueryResult(queryResult) {
    const {
      fields,
      rows,
      rowCount,
      affectedRows,
      queryIndex,
      totalQueries,
      command,
      isMultipleResults,
    } = queryResult;

    const isSelect = command === 'SELECT';
    const isExplain = command === 'EXPLAIN';
    const isUnknown = command === 'UNKNOWN';
    if (!isSelect && !isExplain && !isUnknown) {
      const msgAffectedRows = affectedRows ? `Affected rows: ${affectedRows}.` : '';
      return (
        <Message
          key={`msgAffectedRows-${queryIndex}`}
          message={`Query executed successfully. ${msgAffectedRows}`}
          type="success" />
      );
    }

    if (isExplain) {
      const title = fields[0].name;
      return (
        <Message
          key={queryIndex}
          preformatted
          title={title}
          message={rows.map(row => row[title]).join('\n')}
        />
      );
    }

    let msgDuplicatedColumns = null;
    const groupFields = groupBy(fields, (field) => field.name);
    const duplicatedColumns = Object
      .keys(groupFields)
      .filter(field => groupFields[field].length > 1);
    if (duplicatedColumns.length) {
      msgDuplicatedColumns = (
        <Message
          key={`msgDuplicatedColumns-${queryIndex}`}
          type="info"
          message={
            `Duplicated columns: ${duplicatedColumns.join(', ')}. ` +
            'It may cause the result in the second column overwriting the first one. ' +
            'Use an alias to avoid it.'
          } />
      );
    }

    let widthOffset = this.props.widthOffset;
    if (isMultipleResults) {
      widthOffset += 30; // padding of the query result box
    }

    const tableResult = (
      <QueryResultTable
        config={this.props.config}
        key={queryIndex}
        widthOffset={widthOffset}
        heigthOffset={this.props.heigthOffset}
        resultItemsPerPage={this.props.resultItemsPerPage}
        copied={this.props.copied}
        saved={this.props.saved}
        fields={fields}
        rows={rows}
        rowCount={rowCount}
        onSaveToFileClick={this.props.onSaveToFileClick}
        onCopyToClipboardClick={this.props.onCopyToClipboardClick} />
    );

    if (totalQueries === 1) {
      return (
        <div key={queryIndex}>
          {msgDuplicatedColumns}
          {tableResult}
        </div>
      );
    }

    return (
      <div key={queryIndex} className="ui segment">
        <div className="ui top left attached label">
          Query {queryIndex + 1}
        </div>
        {msgDuplicatedColumns}
        {tableResult}
      </div>
    );
  }

  render() {
    const { isExecuting, error, results } = this.props;
    if (error) {
      if (error.message) {
        const errorBody = Object.keys(error)
          .filter(key => error[key] && key !== 'message')
          .map(key => `${key}: ${error[key]}`)
          .join('\n');

        return (
          <Message
            preformatted
            type="negative"
            title={error.message}
            message={errorBody}
          />
        );
      }
      return <pre>{JSON.stringify(error, null, 2)}</pre>;
    }

    if (isExecuting) {
      return (
        <div ref="loader" style={{ minHeight: '250px' }}>
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
