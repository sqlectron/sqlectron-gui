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
    $(ref.current).dimmer('show');
    return () => {
      if (!ref.current) {
        return;
      }
      $(ref.current).dimmer('hide');
    };
  }, []);

  return (
    <div className={`ui ${type} ${inverted ? 'inverted' : ''} dimmer`} ref={ref}>
      <div className={`ui ${message ? 'text' : ''} loader`}>{message}</div>
    </div>
  );
};

Loader.displayName = 'Loader';

export default Loader;
