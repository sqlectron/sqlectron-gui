import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import shallowCompare from 'react-addons-shallow-compare';
import raf from 'raf';

export default class Scroller extends Component {
  static propTypes = {
    /**
     * Function respondible for rendering children.
     * This function should implement the following signature:
     *
     */
    height: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number]),
    width: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number]),
    children: PropTypes.func.isRequired,

  }

  constructor (props) {
    super(props);
    this.state = {
      scrollTop: 0,
      scrollHeight: 0,
      offsetTop: 0,
      scrollContainerHeight: 0,
    };
  }

  componentDidMount () {
    this.setState({
      scrollTop: this.refs.scrollContainer.scrollTop,
      scrollHeight: this.refs.scrollContainer.offsetHeight,
      offsetTop: ReactDOM.findDOMNode(this).getBoundingClientRect().top,
      scrollContainerHeight: ReactDOM.findDOMNode(this.refs.scrollContainer).
        getBoundingClientRect().height,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUnmount () {
  }

  onScroll () {
    this.setNextState({
      scrollTop: Math.max(0, this.refs.scrollContainer.scrollTop),
    });
  }
  /**
   * Updates the state during the next animation frame.
   * Use this method to avoid multiple renders in a small span of time.
   * This helps performance for bursty events (like onScroll).
   */
  setNextState (state) {
    if (this.setNextStateAnimationFrameId) {
      raf.cancel(this.setNextStateAnimationFrameId);
    }

    this.setNextStateAnimationFrameId = raf(() => {
      this.setNextStateAnimationFrameId = null;
      this.setState(state);
    });
  }

  render () {
    const { children, width, height } = this.props;
    const { scrollTop, scrollHeight, offsetTop, scrollContainerHeight } = this.state;

    return (
      <div style={{
        height,
        width,
        overflow: 'hidden',
        paddingTop: '100px',
        boxSizing: 'border-box',
        position: 'relative',
      }}>
        <div
          onScroll={::this.onScroll}
          ref="scrollContainer"
          style={{
            height,
            width,
            overflowY: 'auto',
            overflowX: 'hidden',
            marginTop: '-100px',
          }}>
          {children({
            scrollHeight,
            scrollTop,
            offsetTop,
            scrollContainerHeight,
          })}
        </div>
      </div>
    );
  }

}
