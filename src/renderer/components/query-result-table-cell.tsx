import isPlainObject from 'lodash/isPlainObject';
import classNames from 'classnames';
import React, { FC, MouseEvent, useCallback, useEffect, useState } from 'react';
import ContextMenu from '../utils/context-menu';
import * as eventKeys from '../../common/event';
import { valueToString } from '../../common/utils/convert';

const MENU_CTX_ID = 'CONTEXT_MENU_TABLE_CELL';

interface Props {
  rowIndex: number;
  col: string;
  data: any;
  onOpenPreviewClick: (value: any) => void;
}

const QueryResultTableCell: FC<Props> = ({ rowIndex, col, data, onOpenPreviewClick }) => {
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [showMenuEvent, setShowMenuEvent] = useState<MouseEvent | null>(null);

  useEffect(() => {
    if (contextMenu) {
      return () => {
        contextMenu.dispose();
      };
    }
  }, [contextMenu]);

  const getValue = useCallback(() => {
    return data[rowIndex][col];
  }, [data, col, rowIndex]);

  const onContextMenu = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();

      const value = getValue();

      const hasPreview = typeof value === 'string' || isPlainObject(value);

      if (!contextMenu && hasPreview) {
        const newContextMenu = new ContextMenu(MENU_CTX_ID);

        newContextMenu.append({
          label: 'Open Preview',
          event: eventKeys.BROWSER_MENU_OPEN_PREVIEW,
          click: () => onOpenPreviewClick(value),
        });

        newContextMenu.build();
        setContextMenu(newContextMenu);
      }
      event.persist();
      setShowMenuEvent(event);
    },
    [contextMenu, getValue, onOpenPreviewClick],
  );

  useEffect(() => {
    if (showMenuEvent && contextMenu) {
      contextMenu.popup({
        x: showMenuEvent.clientX,
        y: showMenuEvent.clientY,
      });
      setShowMenuEvent(null);
    }
  }, [contextMenu, showMenuEvent]);

  const value = getValue();
  const className = classNames({
    'ui mini grey label table-cell-type-null': value === null,
  });

  return (
    <div className="item" onContextMenu={onContextMenu}>
      {value === null ? <span className={className}>NULL</span> : valueToString(value)}
    </div>
  );
};

QueryResultTableCell.displayName = 'QueryResultTableCell';
export default QueryResultTableCell;
