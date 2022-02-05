import React, { CSSProperties, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import groupBy from 'lodash/groupBy';
import CollapseIcon from './collapse-icon';
import DatabaseItem from './database-item';
import type { Database } from '../reducers/databases';
import type { DbTable } from '../../common/types/database';
import type { ActionType, ObjectType } from '../reducers/sqlscripts';
import type { ColumnsByTable } from '../reducers/columns';
import type { TriggersByTable } from '../reducers/triggers';
import type { IndexesByTable } from '../reducers/indexes';

const STYLE: Record<string, CSSProperties> = {
  header: { fontSize: '0.85em', color: '#636363' },
  menu: { marginLeft: '5px' },
  item: { wordBreak: 'break-all', cursor: 'default' },
};

interface Props<T extends { schema?: string; name: string }> {
  title: string;
  client: string;
  items: undefined | null | T[];
  columnsByTable?: ColumnsByTable;
  triggersByTable?: TriggersByTable;
  indexesByTable?: IndexesByTable;
  collapsed?: boolean;
  database: Database;
  onExecuteDefaultQuery?: (database: Database, table: DbTable) => void;
  onSelectItem?: (database: Database, item: DbTable) => void;
  onGetSQLScript: (
    database: Database,
    item: { name: string; schema?: string },
    actionType: ActionType,
    objectType: ObjectType,
  ) => void;
}

const DatabaseListItemMetatada = <T extends { schema?: string; name: string }>({
  title,
  client,
  items,
  columnsByTable,
  triggersByTable,
  indexesByTable,
  collapsed = false,
  database,
  onExecuteDefaultQuery,
  onGetSQLScript,
  onSelectItem,
}: PropsWithChildren<Props<T>>) => {
  const [tableUncollapsed, setTableUncollapsed] = useState<Record<string, boolean>>({});

  const [isCollapsed, setIsCollapsed] = useState(!!collapsed);

  const handleTableCollapse = useCallback((key: string) => {
    setTableUncollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const grouped = useMemo(() => (items ? groupBy(items, 'schema') : {}), [items]);

  const spanTitle = isCollapsed ? 'Expand' : 'Collapse';
  const cssClass = isCollapsed ? 'right' : 'down';
  const cssStyle = { ...STYLE.header, ...((!items || !items.length) && { color: 'lightgray' }) };
  if (!items || !items.length) {
    cssStyle.color = 'lightgray';
  }

  return (
    <div className="item">
      <span title={spanTitle} className="header clickable" style={cssStyle}>
        <i className={`${cssClass} triangle icon`} onClick={toggleCollapse} />
        <span>{title}</span>
      </span>
      <div className="menu" style={STYLE.menu}>
        {!items || isCollapsed ? null : !items.length ? (
          <span className="ui grey item">
            <i> No results found</i>
          </span>
        ) : (
          Object.keys(grouped).map((key) => {
            const hasGroup = !(key === 'undefined' || key === undefined || key === '');
            const hasChildren = !!grouped[key].length;
            return (
              <div key={`list-item.${key}.${title}.${database.name}`}>
                {hasGroup ? (
                  <span
                    style={{ ...STYLE.item, cursor: hasChildren ? 'pointer' : 'default' }}
                    className="item"
                    onClick={() => handleTableCollapse(key)}>
                    {hasChildren ? (
                      <CollapseIcon arrowDirection={tableUncollapsed[key] ? 'down' : 'right'} />
                    ) : null}
                    {key}
                  </span>
                ) : null}
                {!hasGroup || (hasChildren && tableUncollapsed[key])
                  ? grouped[key].map((item) => {
                      const hasChildElements = !!onSelectItem;

                      const cssStyle = { ...STYLE.item, marginLeft: hasGroup ? '0.5em' : '0px' };
                      if (isCollapsed) {
                        cssStyle.display = 'none';
                      }
                      cssStyle.cursor = hasChildElements ? 'pointer' : 'default';

                      const { schema, name } = item;
                      const fullName = schema ? `${schema}.${name}` : name;

                      return (
                        <DatabaseItem
                          key={`${key}.${title}.${database.name}.${fullName}`}
                          client={client}
                          database={database}
                          item={item}
                          dbObjectType={title.slice(0, -1)}
                          style={cssStyle}
                          columnsByTable={columnsByTable}
                          triggersByTable={triggersByTable}
                          indexesByTable={indexesByTable}
                          onSelectItem={onSelectItem}
                          onExecuteDefaultQuery={onExecuteDefaultQuery}
                          onGetSQLScript={onGetSQLScript}
                        />
                      );
                    })
                  : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

DatabaseListItemMetatada.displayName = 'DatabaseListItemMetatada';
export default DatabaseListItemMetatada;
