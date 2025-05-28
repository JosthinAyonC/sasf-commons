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
  title = '',
}) => {
  const inputBaseClasses = 'border border-[var(--border)] appearance-none w-4 h-4 rounded-full focus:ring-[var(--focus)]';
  const checkedClasses = 'checked:bg-[var(--primary)] checked:border-[var(--primary)]';
  const cursorClass = disabled ? 'cursor-not-allowed opacity-60 bg-neutral-500' : 'cursor-pointer';

  return (
    <div className={`relative flex items-center`} title={title}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        required={isRequired}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`${inputBaseClasses} ${checkedClasses} ${cursorClass} ${className}`}
      />
      <label htmlFor={id} className={`ml-2 text-neutral-700 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${labelClassName}`}>
        {label}
      </label>
    </div>
  );
};
