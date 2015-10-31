import React, {Component, PropTypes} from 'react';

export default class Message extends Component {
  static propTypes = {
    type: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
  }

  render() {
    const { title, message, type } = this.props;
    return (
      <div className={`ui message ${type}`}>
        {
          title && <div className="header">{title}</div>
        }
        {
          message && <p>{message}</p>
        }
      </div>
    );
  }

}
