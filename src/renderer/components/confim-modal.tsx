import React, { useEffect, useRef } from 'react';

interface ConfirmModalProps {
  title: string;
  message: string;
  context: string;
  onCancelClick: () => void;
  onRemoveClick: () => void;
}

const ConfirmModal = ({
  onCancelClick,
  onRemoveClick,
  title,
  message,
  context,
}: ConfirmModalProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    $(ref.current as HTMLDivElement)
      .modal({
        closable: false,
        detachable: false,
        allowMultiple: true,
        context: context,
        onDeny: () => {
          onCancelClick();
        },
        onApprove: () => {
          onRemoveClick();
        },
      })
      .modal('show');
    return () => {
      $(ref.current as HTMLDivElement).modal('hide');
    };
  }, [ref.current]);

  return (
    <div className="ui modal" ref={ref} style={{ position: 'absolute' }}>
      <div className="header">{title}</div>
      <div className="content">{message}</div>
      <div className="actions">
        <div className="small ui black deny right labeled icon button" tabIndex={0}>
          No
          <i className="ban icon" />
        </div>
        <div className="small ui positive right labeled icon button" tabIndex={0}>
          Yes
          <i className="checkmark icon" />
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
