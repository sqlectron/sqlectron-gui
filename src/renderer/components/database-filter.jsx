import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class DatabaseFilter extends Component {
  static propTypes = {
    value: PropTypes.string,
    placeholder: PropTypes.string,
    isFetching: PropTypes.bool.isRequired,
    onFilterChange: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);

    this.onFilterChange = this.onFilterChange.bind(this);
  }

  onFilterChange(event) {
    this.props.onFilterChange(event.target.value);
  }

  focus() {
    this.refs.searchInput.focus();
  }

  render() {
    const { value, placeholder, isFetching } = this.props;
    return (
      <div className={`ui icon input ${isFetching ? 'loading' : ''}`}>
        <input type="text"
          placeholder={placeholder || 'Search...'}
          value={value}
          ref="searchInput"
          disabled={isFetching}
          onChange={this.onFilterChange} />
        <i className="search icon" />
      </div>
    );
  }
}
