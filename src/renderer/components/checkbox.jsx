import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ name, label, disabled, defaultChecked, onChecked, onUnchecked }) => {
  const ref = useRef(null);

  useEffect(() => {
    $(ref.current).checkbox({ onChecked, onUnchecked });
  }, [ref]);

  return (
    <div className="ui toggle checkbox" ref={ref}>
      <input type="checkbox" name={name} disabled={disabled} defaultChecked={defaultChecked} />
      <label>{label}</label>
    </div>
  );
};

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  onChecked: PropTypes.func.isRequired,
  onUnchecked: PropTypes.func.isRequired,
};

export default Checkbox;
