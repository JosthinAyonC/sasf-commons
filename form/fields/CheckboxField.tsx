import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { FieldError, FieldValues, useFormContext } from 'react-hook-form';

import { CheckboxFieldProps } from './types';

export const CheckboxField = <T extends FieldValues>({
  label,
  name,
  isDisabled = false,
  defaultChecked = false,
  checkClassName,
  labelClassName,
  errorClassName,
}: Omit<CheckboxFieldProps<T>, 'register' | 'error'>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = name
    .split('.')
    .reduce<Record<string, unknown> | undefined>((acc, part) => (acc ? (acc[part] as Record<string, unknown>) : undefined), errors) as FieldError | undefined;

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={name}
        defaultChecked={defaultChecked}
        className={`border border-[var(--border)] accent-[var(--secondary)] rounded-sm focus:ring-[var(--focus)] focus:outline-none bg-[var(--bg)] text-[var(--primary)] cursor-pointer ${isDisabled ? 'cursor-not-allowed bg-[var(--disabled)]' : ''} ${checkClassName}`}
        {...register(name)}
        disabled={isDisabled}
      />
      <label htmlFor={name} className={`text-neutral-700 cursor-pointer ${labelClassName}`}>
        {label}
      </label>
      {error && (
        <span className={`text-[var(--error)] text-xs ${errorClassName}`}>
          <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
          {error.message}
        </span>
      )}
    </div>
  );
};
