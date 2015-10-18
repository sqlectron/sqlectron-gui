import React, { PropTypes } from 'react';
import { debounce } from 'lodash';


const ServerFilter = ({ onFilterChange, onAddClick }) => {
  return (
    <div className="ui small action left icon input fluid"
        style={{marginBottom: '1em', fontSize: '0.8em'}}>
      <i className="search icon"></i>
      <input type="text" placeholder="Search..." onChange={debounce(onFilterChange, 200)} />
      <button className="ui button green" onClick={onAddClick}>Add</button>
    </div>
  );
};


ServerFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
};


export default ServerFilter;
