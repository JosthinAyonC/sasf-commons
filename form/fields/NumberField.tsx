import { faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { FieldError, FieldValues, useFormContext } from 'react-hook-form';
import { Tooltip } from '~/components/ui';
import { PortalTooltip } from '~/components/ui/PortalTooltip';

import { NumberFieldProps } from './types';

export const NumberField = <T extends FieldValues>({
  label,
  name,
  min,
  max,
  className,
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
  minValueMsg,
  maxValueMsg,
  numberType = 'float',
  additionalInformation,
}: Omit<NumberFieldProps<T>, 'register' | 'error'> & { numberType?: 'integer' | 'float' }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = name
    .split('.')
    .reduce<Record<string, unknown> | undefined>((acc, part) => (acc ? (acc[part] as Record<string, unknown>) : undefined), errors) as FieldError | undefined;
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    // Definir la regex según el tipo de número
    const regex = numberType === 'integer' ? /^\d*$/ : /^[\d.,]*$/;

    if (!regex.test(value)) {
      setTooltipMessage(`Solo se permiten ${numberType === 'integer' ? 'números enteros' : 'números'}.`);
      const cursorPosition = event.currentTarget.selectionStart || 0;
      event.currentTarget.value = value.slice(0, cursorPosition - 1) + value.slice(cursorPosition);
      event.currentTarget.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
      event.preventDefault();
      return;
    }

    // Normalizar la coma a punto si es número flotante
    if (numberType === 'float') {
      value = value.replace(',', '.');
    }

    // Validar si es un número válido
    if (isNaN(Number(value))) {
      setTooltipMessage('Por favor ingrese un número válido');
      event.preventDefault();
      return;
    }

    setTooltipMessage(null);

    // Llamar al callback `onChange` si existe.
    if (onChange) {
      onChange(Number(value));
    }
  };

  return (
    <div className={`relative ${className || ''}`}>
      {label && (
        <label htmlFor={name as string} className={`text-neutral-700 ${labelClassName} block`}>
          {label} {isRequired && <span className="text-[var(--error)]">*</span>}
        </label>
      )}

      <div className="flex w-full">
        {additionalInformation && (
          <div className="relative flex items-center justify-center w-[10%] bg-[var(--bg)] border border-r-0 border-[var(--border)] rounded-l-md">
            <PortalTooltip content={additionalInformation}>
              <FontAwesomeIcon icon={faInfoCircle} className="text-[var(--info)] cursor-pointer" />
            </PortalTooltip>
          </div>
        )}
        <input
          key={name}
          type="text"
          id={name as string}
          placeholder={placeholder}
          defaultValue={defaultValue}
          disabled={disabled}
          {...register(name, {
            onChange: handleInput,
            required: isRequired ? requiredMsg || ' Este campo es obligatorio' : undefined,
            min: min ? { value: min, message: minValueMsg ? minValueMsg(min) : ` El valor mínimo es ${min}` } : undefined,
            max: max ? { value: max, message: maxValueMsg ? maxValueMsg(max) : ` El valor máximo es ${max}` } : undefined,
          })}
          className={`border border-[var(--border)] rounded-md p-2 w-full 
            focus:outline-none focus:border-[var(--focus)] placeholder:text-[var(--placeholder)] 
            bg-[var(--bg)] text-[var(--font)] ${disabled ? 'cursor-not-allowed bg-[var(--disabled)]' : ''}
            ${additionalInformation ? 'rounded-l-none' : ''} ${inputClassName}`}
          autoComplete="off"
        />
      </div>

      {showTootip && tooltipMessage && <Tooltip message={tooltipMessage} variant="info" />}
      <div className="flex justify-between items-center mt-1">
        {error && (
          <span className={`text-[var(--error)] text-xs flex items-center ${errorClassName}`}>
            <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
            {error.message}
          </span>
        )}
      </div>
    </div>
  );
};
