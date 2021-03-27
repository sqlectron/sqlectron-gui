import React, { ChangeEvent, FC, useCallback } from 'react';

interface Props {
  name: string;
  label: string;
  disabled?: boolean;
  checked: boolean;
  onChecked: () => void;
  onUnchecked: () => void;
}

const Checkbox: FC<Props> = ({ name, label, disabled, checked, onChecked, onUnchecked }) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        onChecked();
      } else {
        onUnchecked();
      }
    },
    [onChecked, onUnchecked],
  );

  return (
    <div className="ui toggle checkbox">
      <input
        type="checkbox"
        name={name}
        disabled={disabled}
        onChange={handleChange}
        checked={checked === true}
      />
      <label>{label}</label>
    </div>
  );
};

export default Checkbox;
