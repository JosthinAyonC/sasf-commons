import React from 'react';
import { FieldValues, useController } from 'react-hook-form';
import Select, { MultiValue, SingleValue } from 'react-select';

import { DropdownFieldProps, Option } from './types';

// TODO: PERSONALIZAR ESTILOS
export const DropdownField = <T extends FieldValues>({
  label,
  name,
  control,
  options,
  isMulti = false,
  placeholder = 'Seleccione...',
  isClearable = false,
  labelClassName,
  selectClassName,
  errorClassName,
  containerClassName,
  isRequired = false,
  rules,
}: DropdownFieldProps<T>) => {
  const {
    field: { value, onChange, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      ...rules,
      required: isRequired ? 'Este campo es obligatorio' : false,
    },
  });

  const handleChange = (selected: SingleValue<Option> | MultiValue<Option>) => {
    if (isMulti) {
      const selectedValues = (selected as MultiValue<Option>)?.map((option) => option.value);
      onChange(selectedValues);
    } else {
      onChange((selected as SingleValue<Option>)?.value || null);
    }
  };

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label htmlFor={name as string} className={`text-[var(--font)] ${labelClassName} block mb-2`}>
          {label}
          {isRequired && <span className="text-[var(--error)] ml-1">*</span>}
        </label>
      )}
      <Select
        options={options}
        isMulti={isMulti}
        placeholder={placeholder}
        isClearable={isClearable}
        value={isMulti ? options.filter((opt) => value?.includes(opt.value)) : options.find((opt) => opt.value === value)}
        onChange={handleChange}
        classNamePrefix="react-select"
        className={`border rounded-md focus:border-[var(--primary)] ${selectClassName}`}
        ref={ref}
      />
      {error && <span className={`text-[var(--error)] text-sm mt-1 ${errorClassName}`}>{error.message}</span>}
    </div>
  );
};
