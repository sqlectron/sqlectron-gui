export function rowsValuesToString(rows) {
  return rows.map(rowValuesToString);
}


export function rowValuesToString(row) {
  if (Array.isArray(row)) {
    return rowsValuesToString(row);
  }

  return Object.keys(row).reduce((_row, col) => {
    _row[col] = valueToString(row[col]);
    return _row;
  }, {});
}


export function valueToString(value) {
  if (value === null) {
    return 'NULL';
  }
  if (typeof value === 'boolean') {
    return value.toString();
  }
  if (!value) {
    return String(value);
  }
  if (value.toISOString) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}
