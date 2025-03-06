import React from 'react';

import { CheckBoxUiProps } from './types';

export const CheckBoxUi: React.FC<CheckBoxUiProps> = ({ defaultChecked, checked, className, onChange, disabled }) => {
  return (
    <input
      type="checkbox"
      defaultChecked={defaultChecked}
      checked={checked}
      onChange={onChange}
      className={`border border-[var(--border)] accent-[var(--secondary)] rounded-sm focus:ring-[var(--focus)] focus:outline-none bg-[var(--bg)] text-[var(--primary)] cursor-pointer scale-125
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
    />
  );
};
