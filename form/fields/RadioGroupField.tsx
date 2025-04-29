import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { FieldError, FieldValues, useFormContext } from 'react-hook-form';

import RadioButton from './RadioButton';
import { RadioGroupProps } from './types';

export const RadioGroupField = <T extends FieldValues>({
  name,
  options,
  required = false,
  groupClassName,
  optionClassName,
  optionLabelClassName,
  errorClassName,
  defaultCheckedValue,
}: Omit<RadioGroupProps<T>, 'register' | 'error'>) => {
  const {
    formState: { errors },
  } = useFormContext();

  const error = name
    .split('.')
    .reduce<Record<string, unknown> | undefined>((acc, part) => (acc ? (acc[part] as Record<string, unknown>) : undefined), errors) as FieldError | undefined;

  return (
    <div className={`flex flex-col justify-center my-4 gap-4 ${groupClassName}`}>
      <div className="flex gap-4">
        {options.map((option) => (
          <RadioButton
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            defaultChecked={defaultCheckedValue === option.value}
            isRequired={required}
            optionClassName={optionClassName}
            optionLabelClassName={optionLabelClassName}
          />
        ))}
      </div>
      {error && (
        <span className={`text-[var(--error)] text-xs mt-2 ${errorClassName}`}>
          <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
          {error.message}
        </span>
      )}
    </div>
  );
};
