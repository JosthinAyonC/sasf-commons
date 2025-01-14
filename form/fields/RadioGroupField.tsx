import React from 'react';
import { FieldError, FieldValues, useFormContext } from 'react-hook-form';
import RadioButton from './RadioButton';
import { RadioGroupProps } from './types';

const RadioGroupField = <T extends FieldValues>({
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

  const error = errors[name] as FieldError | undefined;

  return (
    <div className={`flex flex-col justify-center my-4 ${groupClassName}`}>
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
        <span className={`text-[var(--error)] mt-2 ${errorClassName}`}>
          {error.message}
        </span>
      )}
    </div>
  );
};

export default RadioGroupField;
