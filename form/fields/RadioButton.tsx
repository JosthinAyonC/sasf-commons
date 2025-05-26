// components/form/RadioButton.tsx
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { RadioButtonUI } from '../ui/RadioButtonUi';
import { RadioButtonProps } from './types';

const RadioButton: React.FC<RadioButtonProps> = ({ name, value, label, isRequired = false, optionClassName, optionLabelClassName, disabled = false }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: isRequired ? 'Selecciona una opción' : undefined }}
      render={({ field }) => (
        <RadioButtonUI
          id={`${name}-${value}`}
          name={field.name}
          value={value}
          label={label}
          isRequired={isRequired}
          disabled={disabled}
          checked={field.value === value}
          className={optionClassName}
          labelClassName={optionLabelClassName}
          onChange={() => field.onChange(value)}
        />
      )}
    />
  );
};

export default RadioButton;
