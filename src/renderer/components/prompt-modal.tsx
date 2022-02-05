import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

interface Props {
  onCancelClick: () => void;
  onOKClick: (value: string) => void;
  title: string;
  message: string;
  type: string;
}

const PromptModal: FC<Props> = ({ onCancelClick, onOKClick, title, message, type }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState('');

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const elem = ref.current;
    $(elem).modal({
      closable: false,
      detachable: false,
      onDeny: () => {
        onCancelClick();
      },
      onApprove: () => {
        onOKClick(value);
      },
    });
  }, [ref, onCancelClick, onOKClick, value]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const elem = ref.current;
    $(elem).modal('show');
    return () => {
      $(elem).modal('hide');
    };
  }, [ref]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent<HTMLInputElement>): void => {
      if (event.key === 'Enter') {
        onOKClick(value);
      }
    },
    [onOKClick, value],
  );

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event?.target.value);
  }, []);

  return (
    <div className="ui modal" ref={ref}>
      <div className="header">{title}</div>
      <div className="content">
        {message}
        <div className="ui fluid icon input">
          <input onChange={handleChange} type={type} onKeyPress={handleKeyPress} />
        </div>
      </div>
      <div className="actions">
        <div className="small ui black deny right labeled icon button" tabIndex={0}>
          Cancel
          <i className="ban icon" />
        </div>
        <div className="small ui positive right labeled icon button" tabIndex={0}>
          OK
          <i className="checkmark icon" />
        </div>
      </div>
    </div>
  );
};

PromptModal.displayName = 'PromptModal';
export default PromptModal;
