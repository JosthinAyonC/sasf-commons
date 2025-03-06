import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { FieldError, FieldValues, useFormContext } from 'react-hook-form';
import { Tooltip } from '~/components/ui';

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
  showTootip = true,
  onChange,
  requiredMsg,
  disabled = false,
}: Omit<NumberFieldProps<T>, 'register' | 'error'>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name] as FieldError | undefined;
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Regex para permitir solo números, `.` y `,`.
    const regex = /^[\d.,]*$/;

    if (!regex.test(value)) {
      setTooltipMessage('En este campo solo se pueden ingresar números, "." o ","');
      event.currentTarget.value = value.slice(0, -1);
      event.preventDefault();
      return;
    }

    // Reemplazar `,` con `.` para interpretarlo como número.
    const normalizedValue = value.replace(',', '.');

    // Verificar si el valor convertido es un número válido.
    if (isNaN(Number(normalizedValue))) {
      setTooltipMessage('Por favor ingrese un número válido');
      event.preventDefault();
      return;
    }

    setTooltipMessage(null);

    // Llamar al callback `onChange` si existe.
    if (onChange) {
      onChange(Number(normalizedValue));
    }
  };

  return (
    <div className="relative">
      {label && (
        <label htmlFor={name as string} className={`${labelClassName} block text-[var(--font)]`}>
          {label} {isRequired && <span className="text-[var(--error)]">*</span>}
        </label>
      )}
      <input
        type="text"
        id={name as string}
        placeholder={placeholder}
        defaultValue={defaultValue}
        disabled={disabled}
        {...register(name, {
          onChange: handleInput,
          required: isRequired ? requiredMsg || 'Este campo es obligatorio' : undefined,
          min: min ? { value: min, message: `El valor mínimo es ${min}` } : undefined,
          max: max ? { value: max, message: `El valor máximo es ${max}` } : undefined,
        })}
        className={`border border-[var(--border)] rounded-md p-2 w-full 
            focus:outline-none focus:border-[var(--focus)] placeholder:text-[var(--placeholder)] 
            bg-[var(--bg)] text-[var(--font)] ${disabled ? 'cursor-not-allowed bg-[var(--disabled)]' : ''}
            ${inputClassName}`}
        autoComplete="off"
      />
      {showTootip && <Tooltip message={tooltipMessage || ''} variant="danger" />}
      {error && (
        <span className={`text-[var(--error)] text-xs ${errorClassName}`}>
          <FontAwesomeIcon icon={faExclamationCircle} className="" />
          {error.message}
        </span>
      )}
    </div>
  );
};
