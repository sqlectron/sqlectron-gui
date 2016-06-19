import React, { Component, PropTypes } from 'react';

export default class Loading extends Component {
  static propTypes = {
    message: PropTypes.string,
    type: PropTypes.string,
    inverted: PropTypes.bool,
  }

  componentDidMount() {
    $(this.refs.loader).dimmer('show');
  }

  componentWillUnmount() {
    $(this.refs.loader).dimmer('hide');
  }

  render() {
    const { message, type } = this.props;
    const inverted = this.props.inverted ? 'inverted' : '';
    return (
      <div className={`ui ${type} ${inverted} dimmer`} ref="loader">
        <div className={`ui ${message ? 'text' : ''} loader`}>{message}</div>
      </div>
    );
  }

}
