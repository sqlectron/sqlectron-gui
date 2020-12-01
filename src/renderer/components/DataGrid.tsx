import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useTable } from 'react-table';
import { theme } from '../theme';
import { QueryResult } from '../types/queryResult';

export interface DataGridProps {
  queryResult: QueryResult;
}

const dataItem = {
  id: 1,
  name: 'Max Nunes',
  country: 'Brazil',
  city: 'Florianopolis',
  age: 30,
  createdAt: '2020-01-04',
  updatedAt: '2020-02-13',
  active: 'true',
};
const data: any = [];
for (let i = 0; i < 5; i++) {
  data.push(dataItem);
}

const Styles = styled.div`
  table {
    width: 100%;
    font-size: 0.7em;
    border-spacing: 0;
    border: 1px solid ${theme.colors.gray['900']};

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.1rem 0.3rem;
      border-bottom: 1px solid ${theme.colors.gray['900']};
      border-right: 1px solid ${theme.colors.gray['900']};

      :last-child {
        border-right: 0;
      }
    }

    tbody tr:nth-child(odd) {
      background-color: ${theme.colors.darkThemeApp.barCompoenentBg};
    }
  }
`;

function Table({ columns, data }: { columns: any; data: any }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup: any) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column: any) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row: any, i: number) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell: any) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export const DataGrid = ({ queryResult }: DataGridProps) => {
  const columns = useMemo(
    () =>
      queryResult.fields.map((column) => ({
        Header: column.name,
        accessor: column.name,
      })),
    [queryResult.fields],
  );

  return (
    <Styles>
      <div>
        <div>
          <Table columns={columns} data={queryResult.rows} />
        </div>
      </div>
    </Styles>
  );
};
