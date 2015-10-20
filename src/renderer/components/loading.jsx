import React, {Component, PropTypes} from 'react';

export default class LoadingPage extends Component {
  static propTypes = {
    text: PropTypes.string,
  }

  render() {
    return <span>Crunching stdout...</span>;
  }

}
