import React, { ChangeEvent, ChangeEventHandler, FC, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';

interface Props {
  onFilterChange: ChangeEventHandler<HTMLInputElement>;
  onAddClick: () => void;
  onSettingsClick: () => void;
}

const ServerFilter: FC<Props> = ({ onFilterChange, onAddClick, onSettingsClick }) => {
  const debouncedFilterChange = useMemo(() => debounce(onFilterChange, 200), [onFilterChange]);

  const handleFilterChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      event.persist();
      debouncedFilterChange(event);
    },
    [debouncedFilterChange],
  );

  return (
    <div
      className="ui small action left icon input fluid"
      style={{ marginBottom: '1em', fontSize: '0.8em' }}>
      <i className="search icon" />
      <input type="text" placeholder="Search..." onChange={handleFilterChange} />
      <button className="ui button green" onClick={onAddClick}>
        Add
      </button>
      <button className="ui button" onClick={onSettingsClick}>
        Settings
      </button>
    </div>
  );
};

ServerFilter.displayName = 'ServerFilter';

export default ServerFilter;
