import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Controller, FieldError, FieldValues, useFormContext, useWatch } from 'react-hook-form';

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
  showCharacterIndicator = false,
}: Omit<TextFieldProps<T>, 'register' | 'error'>) => {
  const {
    formState: { errors },
    control,
  } = useFormContext();

  const error = name
    .split('.')
    .reduce<Record<string, unknown> | undefined>((acc, part) => (acc ? (acc[part] as Record<string, unknown>) : undefined), errors) as FieldError | undefined;
  const currentValue = useWatch({ name, control }) || '';
  const characterCount = typeof currentValue === 'string' ? currentValue.length : 0;
  const isOverLimit = maxLength && characterCount > maxLength;
  const [triggerVibration, setTriggerVibration] = useState(false);

  useEffect(() => {
    if (isOverLimit) {
      setTriggerVibration(true);
    }
  }, [characterCount, isOverLimit]);

  return (
    <div className={className}>
      <style>{`
        @keyframes vibrate {
          0% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
          100% { transform: translateX(0); }
        }

        .vibrate {
          animation: vibrate 0.3s ease-in-out;
        }
      `}</style>

      {label && (
        <label htmlFor={name as string} className={`text-neutral-700 ${labelClassName} block`}>
          {label} {isRequired && <span className="text-[var(--error)]">*</span>}
        </label>
      )}
      <Controller
        name={name}
        defaultValue={defaultValue ? (defaultValue as unknown as T[keyof T]) : undefined}
        render={({ field: { onChange: fieldOnChange, value } }) => (
          <TextFieldUI
            inputClassName={inputClassName}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            type={type}
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

      <div className="flex justify-between items-center mt-1">
        {error && (
          <span className={`text-[var(--error)] text-xs flex items-center ${errorClassName}`}>
            <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
            {error.message as string}
          </span>
        )}
        {showCharacterIndicator && maxLength && (
          <span
            className={`text-xs ml-auto ${isOverLimit ? 'text-[var(--error)] vibrate' : 'text-gray-500'} ${triggerVibration && isOverLimit ? 'vibrate' : ''}`}
          >
            {characterCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};
