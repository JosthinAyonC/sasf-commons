import React from 'react';
import { FieldValues, useController } from 'react-hook-form';
import Select, { MultiValue, SingleValue, StylesConfig } from 'react-select';

import { DropdownFieldProps, Option } from './types';

const customStyles: StylesConfig<Option> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: 'var(--bg)',
    borderColor: 'var(--border)',
    borderWidth: '1px',
    color: 'var(--font)',
    boxShadow: 'none',
    borderRadius: '8px',
    '&:hover': {
      borderColor: 'var(--hover)',
    },
  }),
  input: (styles) => ({
    ...styles,
    color: 'var(--font)',
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? 'var(--secondary)' : isFocused ? 'var(--hover)' : 'var(--bg)',
    color: isSelected ? 'var(--font)' : 'var(--font)',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: 'var(--secondary)',
    },
  }),
  placeholder: (styles) => ({
    ...styles,
    color: 'var(--placeholder)',
  }),
  singleValue: (styles) => ({
    ...styles,
    color: 'var(--font)',
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: 'var(--highlight)',
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: 'var(--font)',
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: 'var(--error)',
    ':hover': {
      backgroundColor: 'var(--hover)',
      color: 'var(--font)',
    },
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginTop: '4px',
    zIndex: 10,
  }),
  menuList: (styles) => ({
    ...styles,
    backgroundColor: 'var(--bg)',
    borderRadius: '8px',
    padding: '0',
  }),
};

export const DropdownField = <T extends FieldValues>({
  label,
  name,
  control,
  options,
  isMulti = false,
  placeholder = 'Seleccione...',
  isClearable = false,
  labelClassName,
  errorClassName,
  containerClassName,
  isRequired = false,
  rules,
  disabled = false,
  onChangeSelection,
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
    let selectedValues;

    if (isMulti) {
      selectedValues = (selected as MultiValue<Option>)?.map((option) => option.value);
    } else {
      selectedValues = (selected as SingleValue<Option>)?.value || '';
    }

    onChange(selectedValues);

    if (onChangeSelection) {
      onChangeSelection(selectedValues);
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
        styles={customStyles}
        ref={ref}
        isDisabled={disabled}
      />
      {error && <span className={`text-[var(--error)] text-sm mt-1 ${errorClassName}`}>{error.message}</span>}
    </div>
  );
};
