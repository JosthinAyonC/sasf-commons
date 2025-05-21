import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { KeyboardEventHandler } from 'react';
import { FieldValues, useController, useFormContext } from 'react-hook-form';
import { StylesConfig } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { PortalTooltip } from '~/components/ui/PortalTooltip';

import { CreatableTagFieldProps, Option } from './types';

const createOption = (label: string): Option => ({ label, value: label });

const customStyles: StylesConfig<Option, true> = {
  control: (base, { isDisabled }) => ({
    ...base,
    borderRadius: '8px',
    minHeight: '38px',
    borderColor: 'var(--border)',
    backgroundColor: 'var(--bg)',
    boxShadow: 'none',
    '&:hover': {
      borderColor: isDisabled ? 'var(--disabled)' : 'var(--focus)',
      cursor: 'text',
    },
  }),
  input: (styles) => ({
    ...styles,
    color: 'var(--font)',
    padding: '0.2rem',
    margin: '0 -2px',
    backgroundColor: 'transparent',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'var(--secondaryalt)',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'var(--font)',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: 'var(--placeholder)',
    ':hover': {
      backgroundColor: 'var(--secondaryalthover)',
      color: 'var(--font)',
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: 'var(--placeholder)',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--bg)',
    border: '1px solid var(--border)',
    zIndex: 5,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'var(--secondaryalthover)' : 'transparent',
    color: 'var(--font)',
    cursor: 'pointer',
    ':active': {
      backgroundColor: 'var(--secondaryalt)',
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--font)',
  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: 'var(--border)',
  }),
  dropdownIndicator: (base, { isFocused }) => ({
    ...base,
    color: isFocused ? 'var(--focus)' : 'var(--placeholder)',
    ':hover': {
      color: 'var(--focus)',
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: 'var(--font)',
    ':hover': {
      color: 'var(--placeholder)',
    },
  }),
};

export const CreatableTagField = <T extends FieldValues>({
  name,
  label,
  placeholder = 'Escribe y presiona Enter...',
  isRequired = false,
  requiredMsg,
  disabled = false,
  className,
  additionalInformation,
}: CreatableTagFieldProps<T>) => {
  const { control } = useFormContext();

  const {
    field: { value = [], onChange, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required: isRequired ? requiredMsg || 'Este campo es obligatorio' : false,
    },
  });

  const [inputValue, setInputValue] = React.useState('');

  const selectedOptions: Option[] = (value || []).map((v) => createOption(v));

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return;

    if (event.key === 'Enter' || event.key === 'Tab') {
      if (!value.includes(inputValue as never)) {
        onChange([...value, inputValue]);
      }
      setInputValue('');
      event.preventDefault();
    }
  };

  const handleChange = (newValue: readonly Option[] | null) => {
    if (!newValue) {
      onChange([]);
      return;
    }
    onChange(newValue.map((opt) => opt.value));
  };

  return (
    <div className={`w-full ${className || ''}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex w-full">
        {additionalInformation && (
          <div className="relative flex items-center justify-center w-[10%] bg-[var(--bg)] border border-r-0 border-[var(--border)] rounded-l-md">
            <PortalTooltip content={additionalInformation}>
              <FontAwesomeIcon icon={faInfoCircle} className="text-[var(--info)] cursor-pointer" />
            </PortalTooltip>
          </div>
        )}

        <div className={`${additionalInformation ? 'w-[90%]' : 'w-full'}`}>
          <CreatableSelect
            isMulti
            components={{ DropdownIndicator: null }}
            styles={{
              ...customStyles,
              control: (base, state) => ({
                ...(typeof customStyles.control === 'function' ? customStyles.control(base, state) : base),
                borderTopLeftRadius: additionalInformation ? 0 : 8,
                borderBottomLeftRadius: additionalInformation ? 0 : 8,
              }),
            }}
            inputValue={inputValue}
            value={selectedOptions}
            onChange={handleChange}
            onInputChange={setInputValue}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            menuIsOpen={false}
            isDisabled={disabled}
            ref={ref}
          />
        </div>
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};
