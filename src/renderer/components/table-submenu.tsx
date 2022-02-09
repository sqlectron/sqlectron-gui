import React, { CSSProperties, useCallback, useState } from 'react';

const STYLE: Record<string, CSSProperties> = {
  header: { fontSize: '0.85em', color: '#636363' },
  menu: { marginLeft: '5px' },
  item: { wordBreak: 'break-all', cursor: 'default' },
};

interface Props<T> {
  title: string;
  table: string;
  itemsByTable: undefined | { [table: string]: T[] };
  startCollapsed?: boolean;
}

const TableSubmenu = <T extends { name: string; dataType?: string }>({
  title,
  table,
  itemsByTable,
  startCollapsed = false,
}: Props<T>) => {
  const [collapsed, setCollapsed] = useState(startCollapsed);

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  return (
    <div className="item">
      <span
        title={collapsed ? 'Expand' : 'Collapse'}
        className="header clickable"
        onClick={toggleCollapse}
        style={{
          ...STYLE.header,
          ...(!itemsByTable?.[table]?.length ? { color: 'lightgray' } : {}),
        }}>
        <i className={`${collapsed ? 'right' : 'down'} triangle icon`} />
        {title}
      </span>
      <div className="menu" style={STYLE.menu}>
        {collapsed || !itemsByTable?.[table] ? null : !itemsByTable[table].length ? (
          <span className="ui grey item">
            <i> No results found</i>
          </span>
        ) : (
          itemsByTable[table].map((item) => (
            <span
              key={item.name}
              title={item.name}
              style={{ ...STYLE.item, ...(collapsed ? { display: 'none' } : {}) }}
              className="item">
              {title === 'Columns' ? (
                <i className="columns icon" style={{ float: 'left', margin: '0 0.3em 0 0' }} />
              ) : null}
              {item.name}
              {title === 'Columns' ? (
                <span
                  style={{
                    float: 'right',
                    padding: '0 0.5em 0 0.5em',
                    textTransform: 'uppercase',
                  }}>
                  {item.dataType}
                </span>
              ) : null}
            </span>
          ))
        )}
      </div>
    </div>
  );
};

TableSubmenu.displayName = 'TableSubmenu';
export default TableSubmenu;
