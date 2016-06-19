import React, { Component, PropTypes } from 'react';


export default class ServerModalForm extends Component {
  static propTypes = {
    onCancelClick: PropTypes.func.isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    context: PropTypes.string.isRequired,
  }

  componentDidMount() {
    $(this.refs.confirmModal).modal({
      closable: false,
      detachable: false,
      allowMultiple: true,
      context: this.props.context,
      onDeny: () => {
        this.props.onCancelClick();
        return true;
      },
      onApprove: () => {
        this.props.onRemoveClick();
        return false;
      },
    }).modal('show');
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ error: nextProps.error });
  }

  componentWillUnmount() {
    $(this.refs.confirmModal).modal('hide');
  }

  render() {
    const { title, message } = this.props;

    return (
      <div className="ui modal" ref="confirmModal" style={{ position: 'absolute' }}>
        <div className="header">
          {title}
        </div>
        <div className="content">
          {message}
        </div>
        <div className="actions">
          <div className="small ui black deny right labeled icon button" tabIndex="0">
            No
            <i className="ban icon"></i>
          </div>
          <div className="small ui positive right labeled icon button" tabIndex="0">
            Yes
            <i className="checkmark icon"></i>
          </div>
        </div>
      </div>
    );
  }
}
