import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';


export default class ServerFilter extends Component {
  static propTypes = {
    onFilterChange: PropTypes.func.isRequired,
    onAddClick: PropTypes.func.isRequired,
    onSettingsClick: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.onFilterChange = this.onFilterChange.bind(this);
  }

  UNSAFE_componentWillMount () {
    this.delayedCallback = debounce(this.props.onFilterChange, 200);
  }

  onFilterChange (event) {
    event.persist();
    this.delayedCallback(event);
  }

  render () {
    return (
      <div className="ui small action left icon input fluid"
        style={{ marginBottom: '1em', fontSize: '0.8em' }}>
        <i className="search icon" />
        <input type="text" placeholder="Search..." onChange={this.onFilterChange} />
        <button className="ui button green" onClick={this.props.onAddClick}>Add</button>
        <button className="ui button" onClick={this.props.onSettingsClick}>Settings</button>
      </div>
    );
  }
}
