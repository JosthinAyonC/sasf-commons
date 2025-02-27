import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { FieldError, FieldValues, useFormContext } from 'react-hook-form';

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
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name] as FieldError | undefined;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name as string} className={`text-[var(--font)] ${labelClassName} block`}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={name as string}
        placeholder={placeholder}
        defaultValue={defaultValue}
        {...register(name, {
          onChange(e) {
            const value = e.target.value;
            if (onChange) {
              onChange(value);
            }
          },
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
        })}
        className={`border border-[var(--border)] rounded-md p-2 w-full 
          focus:outline-none focus:border-[var(--focus)] placeholder:text-[var(--placeholder)] 
          bg-[var(--bg)] text-[var(--font)] ${disabled ? 'cursor-not-allowed bg-[var(--disabled)]' : ''}
          ${inputClassName}`}
        autoComplete="off"
        disabled={disabled}
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
