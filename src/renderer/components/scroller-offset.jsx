import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class ScrollerOffset extends Component {

  static propTypes = {
    children: PropTypes.func.isRequired,
    scrollTop: PropTypes.number.isRequired,
    offsetTop: PropTypes.number.isRequired,
    scrollHeight: PropTypes.number.isRequired,
    scrollLeft: PropTypes.number,
    offsetLeft: PropTypes.number,
    scrollWidth: PropTypes.number,
  }

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    this.node = ReactDOM.findDOMNode(this);
  }

  render () {
    const { scrollTop, children, scrollHeight, offsetTop } = this.props;

    let adjustTop = 0;

    if (this.node) {
      adjustTop = (this.node.getBoundingClientRect().top - offsetTop) + this.props.scrollTop;
    }

    return (
      <div>
        {children({
          scrollHeight,
          scrollTop: (scrollTop - adjustTop),
        })}
      </div>
    );
  }

}

