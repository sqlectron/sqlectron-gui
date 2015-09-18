import React, {Component, PropTypes} from 'react';

const style = {}

@Radium
export default class LoadingPage extends Component {

  static propTypes = {
    text: PropTypes.string
  }

  render() {
    return <span style={[style]}>Crunching stdout...</span>;
  }

};
