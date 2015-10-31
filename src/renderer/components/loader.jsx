import React, {Component, PropTypes} from 'react';

export default class Loading extends Component {
  static propTypes = {
    message: PropTypes.string,
  }

  componentDidMount() {
    $(this.refs.loader).dimmer('show');
  }

  componentWillUnmount() {
    $(this.refs.loader).dimmer('hide');
  }

  render() {
    const { message, type } = this.props;
    return (
      <div className={`ui ${type} dimmer`} ref="loader">
        <div className={`ui ${message ? 'text' : ''} loader`}>{message}</div>
      </div>
    );
  }

}
