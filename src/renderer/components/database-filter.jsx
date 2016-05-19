import React, { Component, PropTypes } from 'react';


export default class DatabaseFilter extends Component {
  static propTypes = {
    value: PropTypes.string,
    isFetching: PropTypes.bool.isRequired,
    focusSearch: PropTypes.bool,
    onFilterChange: PropTypes.func.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.focusSearch !== nextProps.focusSearch) {
      this.refs.searchInput.focus();
    }
  }

  onFilterChange(event) {
    this.props.onFilterChange(event.target.value);
  }

  render() {
    const { value, isFetching } = this.props;
    return (
      <div className={`ui icon input ${isFetching ? 'loading' : ''}`}>
        <input type="text"
          placeholder="Search..."
          value={value}
          ref="searchInput"
          onChange={::this.onFilterChange} />
        <i className="search icon"></i>
      </div>
    );
  }
}
