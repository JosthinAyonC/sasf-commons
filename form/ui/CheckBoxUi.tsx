import React from 'react';

interface CheckBoxUiProps {
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const CheckBoxUi: React.FC<CheckBoxUiProps> = ({ defaultChecked, checked, onChange, disabled }) => {
  return (
    <input
      type="checkbox"
      defaultChecked={defaultChecked}
      checked={checked}
      onChange={onChange}
      className={`border border-[var(--border)] accent-[var(--secondary)] rounded-sm focus:ring-[var(--focus)] focus:outline-none bg-[var(--bg)] text-[var(--primary)] cursor-pointer scale-150
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
    />
  );
};

export default CheckBoxUi;
