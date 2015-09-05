import React, {Component, PropTypes} from 'react';
import ValidatedComponent from 'utils/ValidatedComponent.jsx'

import {Color} from '../styles/vars.js';

const style = {
  base: {
    fontSize: 14,
    lineHeight: '24px'
  },

  secondary: {
    color: Color.text.secondary
  }
}

@Radium.Enhancer
export default class Body extends ValidatedComponent {

  static propTypes = {
    children: PropTypes.node.isRequired,
    secondary: PropTypes.bool

  }

  render() {
    const {secondary} = this.props;

    return <span style={[style.base, secondary && style.secondary]}>
      {this.props.children}
    </span>;
  }

};
