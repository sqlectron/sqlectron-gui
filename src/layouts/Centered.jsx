import React, {Component, PropTypes} from 'react';

const style = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100vw',
  height: '100vh'
}

/**
 * centers it's children horizontally and vertically
 */
@Radium.Enhancer
export default class Centered extends Component {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    const {children} = this.props;

    return <div style={[style]}>
      {children}
    </div>;
  }

}
