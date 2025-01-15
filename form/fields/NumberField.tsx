import React, { useState } from 'react';
import { FieldError, FieldValues, useFormContext } from 'react-hook-form';

import Tooltip from './Tooltip';
import { NumberFieldProps } from './types';

export const NumberField = <T extends FieldValues>({
  label,
  name,
  min,
  max,
  labelClassName,
  errorClassName,
  inputClassName,
  isRequired = false,
  placeholder,
  defaultValue,
  onChange,
}: Omit<NumberFieldProps<T>, 'register' | 'error'>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name] as FieldError | undefined;
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const regex = /^\d*\.?\d*$/; // Permitir solo números y punto decimal.

    if (!regex.test(value)) {
      setTooltipMessage('En este campo solo se pueden ingresar números');
      event.preventDefault();
    } else {
      setTooltipMessage(null);
      if (onChange) {
        onChange(Number(value));
      }
    }
  };

  return (
    <div className="relative">
      {label && (
        <label htmlFor={name as string} className={`${labelClassName} block text-[var(--font)]`}>
          {label}
        </label>
      )}
      <input
        type="text"
        id={name as string}
        placeholder={placeholder}
        defaultValue={defaultValue}
        {...register(name, {
          onChange: handleInput,
          required: isRequired ? 'Este campo es obligatorio' : undefined,
          min: min ? { value: min, message: `El valor mínimo es ${min}` } : undefined,
          max: max ? { value: max, message: `El valor máximo es ${max}` } : undefined,
        })}
        className={`border border-[var(--border)] rounded-md p-2 w-full 
            focus:outline-none focus:border-[var(--focus)] placeholder:text-[var(--placeholder)] 
            bg-[var(--bg)] text-[var(--font)] 
            ${inputClassName}`}
        autoComplete="off"
      />
      <Tooltip message={tooltipMessage || ''} />
      {error && <span className={`text-[var(--error)] ${errorClassName}`}>{error.message}</span>}
    </div>
  );
};
