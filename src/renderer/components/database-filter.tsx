import React, { ChangeEvent, forwardRef, useCallback } from 'react';

interface Props {
  value?: string;
  placeholder?: string;
  isFetching: boolean;
  onFilterChange: (value: string) => void;
}

const DatabaseFilter = forwardRef<HTMLInputElement, Props>(
  ({ value, placeholder, isFetching, onFilterChange }, ref) => {
    const handleFilterChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>): void => {
        onFilterChange(event.target.value);
      },
      [onFilterChange],
    );

    return (
      <div className={`ui icon input ${isFetching ? 'loading' : ''}`}>
        <input
          type="text"
          placeholder={placeholder || 'Search...'}
          value={value || ''}
          disabled={isFetching}
          onChange={handleFilterChange}
          ref={ref}
        />
        <i className="search icon" />
      </div>
    );
  },
);

DatabaseFilter.displayName = 'DatabaseFilter';

export default DatabaseFilter;
