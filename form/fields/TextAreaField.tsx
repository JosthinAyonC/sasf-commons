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
}: Omit<TextFieldProps<T>, 'register' | 'error'>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name] as FieldError | undefined;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name as string} className={`text-[var(--font)] ${labelClassName} block text-[var(--font)]`}>
          {label}
        </label>
      )}
      <textarea
        {...register(name, {
          required: isRequired ? 'Este campo es obligatorio' : undefined,
        })}
        placeholder={placeholder}
        id={name as string}
        defaultValue={defaultValue}
        autoComplete="off"
        disabled={disabled}
        className={`border border-[var(--border)] rounded-md p-2 focus:outline-none focus:border-[var(--primary)] placeholder:text-[var(--placeholder)] bg-[var(--bg)] text-[var(--font)] w-full min-h-[40px] ${
          error ? 'border-[var(--error)]' : ''
        } ${disabled ? 'cursor-not-allowed bg-[var(--disabled)]' : ''} ${inputClassName}`}
      />
      {error && <span className={`text-[var(--error)] mt-1 block ${errorClassName}`}>{error.message}</span>}
    </div>
  );
};
