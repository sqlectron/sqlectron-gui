import React, { Component, PropTypes } from 'react';

export default class Checkbox extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    onChecked: PropTypes.func.isRequired,
    onUnchecked: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { onChecked, onUnchecked } = this.props;

    $(this.refs.checkbox).checkbox({ onChecked, onUnchecked });
  }

  render () {
    const { name, label, disabled, defaultChecked } = this.props;
    return (
      <div className="ui toggle checkbox" ref="checkbox">
        <input type="checkbox"
          name={name}
          disabled={disabled}
          defaultChecked={defaultChecked} />
        <label>{label}</label>
      </div>
    );
  }
}
