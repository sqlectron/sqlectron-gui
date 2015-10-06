import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { debounce } from 'lodash';


export default class DatabaseFilter extends Component {
  constructor(props, context) {
    super(props, context);
  }

  static propTypes = {
    actions: PropTypes.object.isRequired
  }

  onFilterChange(event) {
    const { actions } = this.props;
    actions.filterDatabases(event.target.value);
  }

  render() {
    const { databases, actions } = this.props;

    return (
      <div className="ui input">
        <input type="text" placeholder="Search..." onChange={debounce(::this.onFilterChange, 200)} />
      </div>
    );
  }
};
