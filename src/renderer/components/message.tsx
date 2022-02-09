import React, { FC, useCallback, useRef } from 'react';

interface Props {
  closeable?: boolean;
  type?: string;
  title?: string;
  message?: string;
  preformatted?: boolean;
}

const Message: FC<Props> = ({ closeable, type, title, message, preformatted }) => {
  const ref = useRef<HTMLDivElement>(null);
  const onClose = useCallback(() => {
    if (ref.current) {
      $(ref.current).transition('fade');
    }
  }, [ref]);

  return (
    <div ref={ref} className={`ui message ${type || ''}`}>
      {closeable && <i className="close icon" onClick={onClose} />}
      {title && <div className="header">{title}</div>}
      {message && preformatted ? <pre>{message}</pre> : <p>{message}</p>}
    </div>
  );
};

Message.displayName = 'Message';

export default Message;
