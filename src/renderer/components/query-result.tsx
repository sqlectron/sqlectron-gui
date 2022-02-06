import { groupBy } from 'lodash';
import React, { FC, ReactElement } from 'react';
import { useAppSelector } from '../hooks/redux';
import Message from './message';
import QueryResultTable from './query-result-table';

interface Props {
  fields: any[];
  rows: any[];
  rowCount: number | undefined;
  affectedRows: number | undefined;
  queryIndex: number;
  totalQueries: number;
  command: string;
  isMultipleResults: boolean;
  widthOffset: number;
  heightOffset: number;
  onCopyToClipboardClick: (rows, type: string, delimiter: string) => void;
  onSaveToFileClick: (rows, type: string, delimiter: string) => void;
  copied: boolean | null;
  saved: boolean | null;
  resultItemsPerPage: number;
}

const QueryResult: FC<Props> = ({
  fields,
  rows,
  rowCount,
  affectedRows,
  queryIndex,
  totalQueries,
  command,
  isMultipleResults,
  widthOffset,
  heightOffset,
  onCopyToClipboardClick,
  onSaveToFileClick,
  copied,
  saved,
  resultItemsPerPage,
}) => {
  const config = useAppSelector((state) => state.config);

  const isSelect = command === 'SELECT';
  const isExplain = command === 'EXPLAIN';
  const isUnknown = command === 'UNKNOWN';
  if (!isSelect && !isExplain && !isUnknown) {
    const msgAffectedRows = affectedRows ? `Affected rows: ${affectedRows}.` : '';
    return (
      <Message
        key={`msgAffectedRows-${queryIndex}`}
        message={`Query executed successfully. ${msgAffectedRows}`}
        type="success"
      />
    );
  }

  if (isExplain) {
    const title = fields[0].name;
    return (
      <Message
        key={`explain-${queryIndex}`}
        preformatted
        title={title}
        message={rows.map((row) => row[title]).join('\n')}
      />
    );
  }

  // Not sure what type of query they ran, but cannot render table, print
  // generic message.
  if (fields.length === 0) {
    return (
      <Message
        key={`genericResult-${queryIndex}`}
        message={`Query executed successfully.`}
        type="success"
      />
    );
  }

  let msgDuplicatedColumns: null | ReactElement = null;
  const groupFields = groupBy(fields, (field) => field.name);
  const duplicatedColumns = Object.keys(groupFields).filter(
    (field) => groupFields[field].length > 1,
  );
  if (duplicatedColumns.length) {
    msgDuplicatedColumns = (
      <Message
        key={`msgDuplicatedColumns-${queryIndex}`}
        type="info"
        message={
          `Duplicated columns: ${duplicatedColumns.join(', ')}. ` +
          'It may cause the result in the second column overwriting the first one. ' +
          'Use an alias to avoid it.'
        }
      />
    );
  }

  let adjustedWidthOffset = widthOffset;
  if (isMultipleResults) {
    adjustedWidthOffset += 30; // padding of the query result box
  }

  const tableResult = (
    <QueryResultTable
      config={config}
      key={queryIndex}
      widthOffset={adjustedWidthOffset}
      heigthOffset={heightOffset}
      resultItemsPerPage={resultItemsPerPage}
      copied={copied}
      saved={saved}
      fields={fields}
      rows={rows}
      rowCount={rowCount}
      onSaveToFileClick={onSaveToFileClick}
      onCopyToClipboardClick={onCopyToClipboardClick}
    />
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
      <div className="ui top left attached label">Query {queryIndex + 1}</div>
      {msgDuplicatedColumns}
      {tableResult}
    </div>
  );
};

QueryResult.displayName = 'QueryResult';
export default QueryResult;
