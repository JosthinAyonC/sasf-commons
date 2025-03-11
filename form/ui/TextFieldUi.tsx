import React from 'react';

import { TextFieldUIProps } from './types';

export const TextFieldUI: React.FC<TextFieldUIProps> = ({ placeholder, defaultValue, inputClassName = '', disabled = false, onChange, value }) => (
  <div>
    <input
      type="text"
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`border border-[var(--border)] rounded-md p-2 w-full 
        focus:outline-none focus:border-[var(--focus)] placeholder:text-[var(--placeholder)] 
        bg-[var(--bg)] text-[var(--font)] ${disabled ? 'cursor-not-allowed bg-[var(--disabled)]' : ''} 
        ${inputClassName}`}
      autoComplete="off"
      disabled={disabled}
    />
  </div>
);
