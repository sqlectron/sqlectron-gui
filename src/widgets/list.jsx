import React, {Component, PropTypes} from 'react';

const style = {
  marginTop: 16,
  borderTop: '1px solid rgba(0,0,0,0.08)',
};

@Radium.Enhancer
export default class List extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired
  }

  render() {

    return <ul style={[style]}>
      {this.props.children}
    </ul>;
  }

};
