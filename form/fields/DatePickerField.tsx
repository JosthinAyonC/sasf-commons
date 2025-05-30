import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { Controller, FieldValues, get, useFormContext } from 'react-hook-form';

import { DatePickerUI } from '../ui/DatePickerUi';
import { DatePickerFieldProps } from './types';

export const DatePickerField = <T extends FieldValues>({
  label,
  name,
  className,
  labelClassName,
  inputClassName,
  errorClassName,
  isRequired = false,
  minDate,
  maxDate,
  defaultValue,
  requiredMsg,
  placeholderText,
  disabled = false,
}: DatePickerFieldProps<T>) => {
  const { setValue, getValues } = useFormContext();

  useEffect(() => {
    const currentValue = get(getValues(), name as string);
    if ((currentValue === undefined || currentValue === null) && defaultValue) {
      setValue(name as string, defaultValue);
    }
  }, [defaultValue, name, setValue, getValues]);

  return (
    <div className={`relative w-full ${className || ''}`}>
      {label && (
        <label htmlFor={name as string} className={`block mb-1 text-neutral-700 ${labelClassName}`}>
          {label}
          {isRequired && <span className="text-[var(--error)] ml-1">*</span>}
        </label>
      )}

      <Controller
        name={name}
        rules={{
          required: isRequired ? requiredMsg || 'Este campo es obligatorio' : undefined,
          validate: {
            min: (value) => !minDate || (value && new Date(value) >= minDate) || 'La fecha debe ser posterior a la mínima.',
            max: (value) => !maxDate || (value && new Date(value) <= maxDate) || 'La fecha debe ser anterior a la máxima.',
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <DatePickerUI
              disabled={disabled}
              key={name}
              selected={value && !isNaN(new Date(value).getTime()) ? new Date(value) : null}
              onChange={onChange}
              minDate={minDate}
              maxDate={maxDate}
              error={error?.message}
              inputClassName={inputClassName}
              placeholderText={placeholderText}
            />
            {error && (
              <p className={`text-[var(--error)] text-xs mt-1 ${errorClassName}`}>
                <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" /> {error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
};
