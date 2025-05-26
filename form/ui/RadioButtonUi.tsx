import React from 'react';

import { RadioButtonUIProps } from './types';

export const RadioButtonUI: React.FC<RadioButtonUIProps> = ({
  id,
  name,
  value,
  label,
  checked,
  onChange,
  className = '',
  labelClassName = '',
  isRequired = false,
  disabled = false,
}) => (
  <div className="relative flex items-center">
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      checked={checked}
      required={isRequired}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      className={`border border-[var(--border)] appearance-none w-4 h-4 rounded-full checked:bg-[var(--primary)] checked:border-[var(--primary)] focus:ring-[var(--focus)] cursor-pointer ${className}`}
    />
    <label htmlFor={id} className={`ml-2 text-neutral-700 cursor-pointer ${labelClassName}`}>
      {label}
    </label>
  </div>
);
