import { debounce } from 'lodash';
import React, { FC, useCallback, useState } from 'react';
import { Tab } from 'react-tabs';

import * as QueryActions from '../actions/queries';
import { useAppDispatch, useAppSelector } from '../hooks/redux';

interface Props {
  queryId: number;
  tabNavPosition: number;
  setTabNavPosition: (position: number) => void;
}

const QueryTab: FC<Props> = ({ queryId, tabNavPosition, setTabNavPosition }) => {
  const dispatch = useAppDispatch();
  const queries = useAppSelector((state) => state.queries);

  const [isRenaming, setIsRenaming] = useState(false);
  const [tabValue, setTabValue] = useState('');

  const removeQuery = useCallback(
    (queryId: number) => {
      dispatch(QueryActions.removeQuery(queryId));
    },
    [dispatch],
  );

  const isCurrentQuery = queryId === queries.currentQueryId;
  const buildContent = () => {
    if (isRenaming) {
      return (
        <div className="ui input">
          <input
            autoFocus
            type="text"
            value={tabValue}
            onBlur={() => {
              dispatch(QueryActions.renameQuery(tabValue));
              setIsRenaming(false);
            }}
            onKeyDown={(event) => {
              if (event.key !== 'Escape' && event.key !== 'Enter') {
                return;
              }

              if (event.key === 'Enter') {
                dispatch(QueryActions.renameQuery(tabValue));
              }

              setIsRenaming(false);
            }}
            defaultValue={queries.queriesById[queryId].name}
          />
        </div>
      );
    }

    return (
      <div>
        {queries.queriesById[queryId].name}
        <button
          className="right floated ui icon button mini"
          onClick={debounce(() => {
            removeQuery(queryId);
            const position = tabNavPosition + 200;
            setTabNavPosition(position > 0 ? 0 : position);
          }, 200)}>
          <i className="icon remove" />
        </button>
      </div>
    );
  };

  return (
    <Tab
      key={queryId}
      onDoubleClick={() => {
        setIsRenaming(true);
        setTabValue(queries.queriesById[queryId].name);
      }}
      className={['react-tabs__tab', `item ${isCurrentQuery ? 'active' : ''}`]}>
      {buildContent()}
    </Tab>
  );
};

QueryTab.displayName = 'QueryTab';

// Required to set `tabsRole` on the component so its understood properly by react-tabs
// @ts-ignore
QueryTab.tabsRole = 'Tab';

export default QueryTab;
