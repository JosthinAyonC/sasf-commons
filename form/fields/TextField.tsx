import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Controller, FieldError, FieldValues, useFormContext } from 'react-hook-form';

import { TextFieldUI } from '../ui/TextFieldUi';
import { TextFieldProps } from './types';

export const TextField = <T extends FieldValues>({
  label,
  name,
  minLength,
  maxLength,
  className,
  labelClassName,
  errorClassName,
  inputClassName,
  isRequired = false,
  validatePassword = false,
  validateEmail = false,
  regexp,
  regexpErrorLabel,
  type = 'text',
  placeholder,
  defaultValue,
  disabled = false,
  onChange,
  requiredMsg,
}: Omit<TextFieldProps<T>, 'register' | 'error'>) => {
  const {
    formState: { errors },
  } = useFormContext();

  const error = errors[name] as FieldError | undefined;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name as string} className={`text-[var(--font)] ${labelClassName} block`}>
          {label} {isRequired && <span className="text-[var(--error)]">*</span>}
        </label>
      )}
      <Controller
        name={name}
        defaultValue={defaultValue ? (defaultValue as unknown as T[keyof T]) : undefined}
        render={({ field: { onChange: fieldOnChange } }) => (
          <TextFieldUI
            inputClassName={inputClassName}
            placeholder={placeholder}
            defaultValue={defaultValue}
            disabled={disabled}
            onChange={(value: string) => {
              fieldOnChange(value);
              if (onChange) onChange(value);
            }}
          />
        )}
        rules={{
          required: isRequired ? requiredMsg || 'Este campo es obligatorio' : undefined,
          minLength: minLength ? { value: minLength, message: `El valor mínimo es ${minLength} caracteres` } : undefined,
          maxLength: maxLength ? { value: maxLength, message: `El valor máximo es ${maxLength} caracteres` } : undefined,
          pattern: regexp
            ? { value: regexp, message: regexpErrorLabel || 'Formato inválido' }
            : type === 'email' && validateEmail
              ? { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Correo electrónico inválido' }
              : type === 'password' && validatePassword
                ? {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    message: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número',
                  }
                : undefined,
        }}
      />
      {error && (
        <span className={`text-[var(--error)] text-xs ${errorClassName}`}>
          <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
          {error.message as string}
        </span>
      )}
    </div>
  );
};
