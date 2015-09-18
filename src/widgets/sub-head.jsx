import React, { Component, PropTypes } from 'react';

const style = {
  fontSize: 16,
  lineHeight: 24
}

@Radium
export default class Subhead extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired
  }

  render() {

    return <span>
      {this.props.children}
    </span>;
  }

};
