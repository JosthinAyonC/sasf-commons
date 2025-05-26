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
    setValue,
    watch,
  } = useFormContext();

  const error = name
    .split('.')
    .reduce<Record<string, unknown> | undefined>((acc, part) => (acc ? (acc[part] as Record<string, unknown>) : undefined), errors) as FieldError | undefined;
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = watch(name);

    // Definir la regex según el tipo de número
    const regex = numberType === 'integer' ? /^\d*$/ : /^[\d.,]*$/;

    // Normalizar comas a puntos si se detecta una coma
    let normalizedValue = value.replace(',', '.');

    // Eliminar ceros a la izquierda (excepto si es "0" o empieza con "0.")
    if (numberType === 'integer') {
      normalizedValue = normalizedValue.replace(/^0+(?=\d)/, '');
    } else {
      normalizedValue = normalizedValue.replace(/^0+(?=\d)/, '');
    }
    setValue(name, normalizedValue);

    if (!regex.test(normalizedValue)) {
      setTooltipMessage(`Solo se permiten ${numberType === 'integer' ? 'números enteros' : 'números'}.`);
      const cursorPosition = event.currentTarget.selectionStart || 0;
      setValue(name, normalizedValue.slice(0, cursorPosition - 1) + normalizedValue.slice(cursorPosition));
      event.currentTarget.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
      event.preventDefault();
      return;
    }

    // Normalizar la coma a punto si es número flotante
    if (numberType === 'float') {
      normalizedValue = normalizedValue.replace(',', '.');
    }

    // Validar si es un número válido
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
