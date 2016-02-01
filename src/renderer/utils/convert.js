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
  if (!value) { return value; }
  if (value.toISOString) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return value;
}
