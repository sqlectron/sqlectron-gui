import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const ConfirmModal = ({ onCancelClick, onRemoveClick, title, message, context }) => {
  const ref = useRef(null);

  useEffect(() => {
    $(ref.current)
      .modal({
        closable: false,
        detachable: false,
        allowMultiple: true,
        context: context,
        onDeny: () => {
          onCancelClick();
          return true;
        },
        onApprove: () => {
          onRemoveClick();
          return false;
        },
      })
      .modal('show');
    return () => {
      $(ref.current).modal('hide');
    };
  }, [ref.current]);

  return (
    <div className="ui modal" ref={ref} style={{ position: 'absolute' }}>
      <div className="header">{title}</div>
      <div className="content">{message}</div>
      <div className="actions">
        <div className="small ui black deny right labeled icon button" tabIndex="0">
          No
          <i className="ban icon" />
        </div>
        <div className="small ui positive right labeled icon button" tabIndex="0">
          Yes
          <i className="checkmark icon" />
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  onCancelClick: PropTypes.func.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  context: PropTypes.string.isRequired,
};

export default ConfirmModal;
