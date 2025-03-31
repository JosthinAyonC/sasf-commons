import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { FieldError, FieldValues, useFormContext } from 'react-hook-form';

import { TextFieldProps } from './types';

export const TextAreaField = <T extends FieldValues>({
  name,
  placeholder,
  label,
  defaultValue,
  disabled,
  isRequired = false,
  inputClassName,
  labelClassName,
  errorClassName,
  requiredMsg,
  rows = 3,
}: Omit<TextFieldProps<T>, 'register' | 'error'> & { rows?: number }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name] as FieldError | undefined;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name as string} className={`text-neutral-700 ${labelClassName} block`}>
          {label} {isRequired && <span className="text-[var(--error)]">*</span>}
        </label>
      )}
      <textarea
        {...register(name, {
          required: isRequired ? requiredMsg || 'Este campo es obligatorio' : undefined,
        })}
        key={name}
        placeholder={placeholder}
        id={name as string}
        defaultValue={defaultValue}
        autoComplete="off"
        disabled={disabled}
        rows={rows}
        className={`border border-[var(--border)] rounded-md p-2 focus:outline-none focus:border-[var(--primary)] placeholder:text-[var(--placeholder)] bg-[var(--bg)] text-[var(--font)] w-full min-h-[40px] ${
          error ? 'border-[var(--error)]' : ''
        } ${disabled ? 'cursor-not-allowed bg-[var(--disabled)]' : ''} ${inputClassName}`}
      />
      {error && (
        <span className={`text-[var(--error)] text-xs flex items-center ${errorClassName}`}>
          <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
          {error.message as string}
        </span>
      )}
    </div>
  );
};
