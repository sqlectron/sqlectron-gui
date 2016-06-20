/** @flow */
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

export default class ScrollerOffset extends Component {
  
  static propTypes = {
    children: PropTypes.func.isRequired,
    scrollTop: PropTypes.number.isRequired,
    offsetTop: PropTypes.number.isRequired,
    scrollHeight: PropTypes.number.isRequired,
    scrollLeft: PropTypes.number,
    offsetLeft: PropTypes.number,
    scrollWidth: PropTypes.number
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {

    this._node = ReactDOM.findDOMNode(this)

  }

  componentWillUnmount () {
  }

  render () {

    const { scrollTop, children, scrollHeight, offsetTop } = this.props

    var adjustTop = 0, adjustLeft = 0;

    if ( this._node ) {
        adjustTop = (this._node.getBoundingClientRect().top-offsetTop)+this.props.scrollTop;
        // Todo: Implement adjustLeft / scrollLeft / scrollWidth
    }

    return (
      <div>
        {children({
          scrollHeight: scrollHeight,
          scrollTop: (scrollTop-adjustTop)
        })}
      </div>
    )
  }

}

