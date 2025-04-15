import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { FieldError, FieldValues, useFormContext } from 'react-hook-form';

import { TextFieldProps } from './types';

export const TextAreaField = <T extends FieldValues>({
  name,
  minLength,
  maxLength,
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
  showCharacterIndicator = true,
}: Omit<TextFieldProps<T>, 'register' | 'error'> & { rows?: number }) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const error = errors[name] as FieldError | undefined;
  const currentValue = watch(name) || '';
  const characterCount = typeof currentValue === 'string' ? currentValue.length : 0;
  const isOverLimit = maxLength && characterCount > maxLength;
  const [triggerVibration, setTriggerVibration] = useState(false);

  useEffect(() => {
    if (isOverLimit) {
      setTriggerVibration(true);
    }
  }, [characterCount, isOverLimit]);

  return (
    <div className="w-full flex flex-col gap-1">
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
      <textarea
        {...register(name, {
          required: isRequired ? requiredMsg || 'Este campo es obligatorio' : undefined,
          minLength: minLength ? { value: minLength, message: `El valor mínimo es ${minLength} caracteres` } : undefined,
          maxLength: maxLength ? { value: maxLength, message: `El valor máximo es ${maxLength} caracteres` } : undefined,
        })}
        key={name}
        placeholder={placeholder}
        id={name as string}
        defaultValue={defaultValue}
        autoComplete="off"
        disabled={disabled}
        rows={rows}
        className={`border border-[var(--border)] rounded-md p-2 focus:outline-none focus:border-[var(--focus)] placeholder:text-[var(--placeholder)] bg-[var(--bg)] text-[var(--font)] w-full min-h-[40px] ${
          error ? 'border-[var(--error)]' : ''
        } ${disabled ? 'cursor-not-allowed bg-[var(--disabled)]' : ''} ${inputClassName}`}
      />
      <div className="flex justify-between items-center">
        {error && (
          <span className={`text-[var(--error)] text-xs flex items-center ${errorClassName}`}>
            <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
            {error.message as string}
          </span>
        )}
        {showCharacterIndicator && maxLength && (
          <span
            className={`text-xs ${isOverLimit ? 'text-[var(--error)] vibrate' : 'text-gray-500'} ml-auto ${triggerVibration && isOverLimit ? 'vibrate' : ''}`}
          >
            {characterCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};
