import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Loader = ({ message, type, inverted }) => {
  const ref = useRef(null);

  useEffect(() => {
    $(ref.current).dimmer('show');
    return () => $(ref.current).dimmer('hide');
  }, []);

  return (
    <div className={`ui ${type} ${inverted ? 'inverted' : ''} dimmer`} ref={ref}>
      <div className={`ui ${message ? 'text' : ''} loader`}>{message}</div>
    </div>
  );
};

Loader.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string,
  inverted: PropTypes.bool,
};

Loader.displayName = 'Loader';

export default Loader;
