import React from 'react';
import { useFormContext } from 'react-hook-form';

import { RadioButtonProps } from './types';

const RadioButton: React.FC<RadioButtonProps> = ({ name, value, label, defaultChecked = false, isRequired = false, optionClassName, optionLabelClassName }) => {
  const { register } = useFormContext();

  return (
    <div className="relative flex items-center">
      <input
        key={name}
        type="radio"
        id={`${name}-${value}`}
        value={value}
        {...register(name, {
          required: isRequired ? 'Selecciona una opción' : undefined,
        })}
        className={`border border-[var(--border)] appearance-none w-4 h-4 rounded-full checked:bg-[var(--primary)] checked:border-[var(--primary)] focus:ring-[var(--focus)] cursor-pointer ${optionClassName}`}
        defaultChecked={defaultChecked}
      />
      <label htmlFor={`${name}-${value}`} className={`ml-2 text-[var(--font)] cursor-pointer ${optionLabelClassName}`}>
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
