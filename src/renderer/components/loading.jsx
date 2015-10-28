import React, {Component, PropTypes} from 'react';

export default class LoadingPage extends Component {
  static propTypes = {
    text: PropTypes.string,
  }

  render() {
    return <div style={{textAlign: 'center'}}>No results</div>;
  }

}
