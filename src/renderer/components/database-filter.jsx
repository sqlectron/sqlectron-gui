import React, { Component, PropTypes } from 'react';
import { debounce } from 'lodash';


export default class DatabaseFilter extends Component {
  static propTypes = {
    onFilterChange: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
  }

  onFilterChange(event) {
    this.props.onFilterChange(event.target.value);
  }

  render() {
    return (
      <div className="ui input">
        <input type="text" placeholder="Search..." onChange={debounce(::this.onFilterChange, 200)} />
      </div>
    );
  }
}
