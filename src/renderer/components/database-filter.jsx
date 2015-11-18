import React, { Component, PropTypes } from 'react';
import { debounce } from 'lodash';


export default class DatabaseFilter extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    onFilterChange: PropTypes.func.isRequired,
  }

  onFilterChange(event) {
    this.props.onFilterChange(event.target.value);
  }

  render() {
    const { isFetching } = this.props;
    return (
      <div className={`ui icon input ${isFetching ? 'loading' : ''}`}>
        <input type="text" placeholder="Search..." onChange={debounce(::this.onFilterChange, 200)} />
        <i className="search icon"></i>
      </div>
    );
  }
}
