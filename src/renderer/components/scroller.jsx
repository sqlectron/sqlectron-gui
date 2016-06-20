/** @flow */
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import shallowCompare from 'react-addons-shallow-compare'
import raf from 'raf'

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
    super(props)
    this.state = {
      scrollTop: 0,
      scrollHeight: 0,
      offsetTop: 0,
      scrollContainerHeight: 0
    }

    this._onScroll = this._onScroll.bind(this)
  }

  componentDidMount () {

    this.setState({"scrollTop":this.refs.scrollContainer.scrollTop,
      "scrollHeight":this.refs.scrollContainer.offsetHeight,
      "offsetTop":ReactDOM.findDOMNode(this).getBoundingClientRect().top,
      "scrollContainerHeight":ReactDOM.findDOMNode(this.refs.scrollContainer).getBoundingClientRect().height});

  }

  componentWillUnmount () {
  }

  /**
   * Updates the state during the next animation frame.
   * Use this method to avoid multiple renders in a small span of time.
   * This helps performance for bursty events (like onScroll).
   */
  _setNextState (state) {
    if (this._setNextStateAnimationFrameId) {
      raf.cancel(this._setNextStateAnimationFrameId)
    }

    this._setNextStateAnimationFrameId = raf(() => {
      this._setNextStateAnimationFrameId = null
      this.setState(state)
    })
  }

  render () {
    const { children, rowCount, rowHeight, width, height } = this.props
    const { scrollTop, top, scrollHeight, offsetTop, scrollContainerHeight } = this.state

    return (
      <div style={{height:height,width:width,overflow:"hidden",paddingTop:"100px",boxSizing:"border-box",position:"relative"}}>
        <div style={{height:height,width:width,overflowY:"auto",overflowX:"hidden",marginTop:"-100px"}} onScroll={this._onScroll} ref="scrollContainer">
          {children({
            scrollHeight: scrollHeight,
            scrollTop: scrollTop,
            offsetTop: offsetTop,
            scrollContainerHeight: scrollContainerHeight
          })}
        </div>
      </div>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _onScroll (event) {
    this._setNextState({
      scrollTop: Math.max(0, this.refs.scrollContainer.scrollTop)
    })
  }
}
