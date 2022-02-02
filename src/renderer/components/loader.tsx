import React, { FC, useEffect, useRef } from 'react';

interface Props {
  message?: string;
  type: string;
  inverted?: boolean;
}

const Loader: FC<Props> = ({ message, type, inverted = false }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const elem = ref.current;
    $(elem).dimmer('show');
    return () => {
      $(elem).dimmer('hide');
    };
  }, [ref]);

  return (
    <div className={`ui ${type} ${inverted ? 'inverted' : ''} dimmer`} ref={ref}>
      <div className={`ui ${message ? 'text' : ''} loader`}>{message}</div>
    </div>
  );
};

Loader.displayName = 'Loader';

export default Loader;
