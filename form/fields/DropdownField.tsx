import { faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { FieldValues, useController } from 'react-hook-form';
import Select, { MultiValue, SingleValue, StylesConfig } from 'react-select';
import { PortalTooltip } from '~/components/ui/PortalTooltip';

import { DropdownFieldProps, Option } from './types';

export const customStyles = (hasAdditionalInfo: boolean): StylesConfig<Option> => ({
  control: (styles, { isDisabled }) => ({
    ...styles,
    backgroundColor: isDisabled ? 'var(--disabled)' : 'var(--bg)',
    borderColor: isDisabled ? 'var(--disabled)' : 'var(--border)',
    borderWidth: '1px',
    color: isDisabled ? 'var(--disabled)' : 'var(--font)',
    boxShadow: 'none',
    borderRadius: '8px',
    ...(hasAdditionalInfo && {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    }),
    '&:hover': {
      borderColor: isDisabled ? 'var(--disabled)' : 'var(--focus)',
      cursor: 'text',
    },
  }),
  input: (styles) => ({
    ...styles,
    color: 'var(--font)',
    padding: '0.4rem',
    margin: '0 -4px',
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    display: 'flex',
    backgroundColor: isSelected || isFocused ? 'var(--secondaryalt)' : 'var(--bg)',
    color: 'var(--font)',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: 'var(--secondaryalt)',
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
  menu: (styles) => ({
    ...styles,
    backgroundColor: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginTop: '4px',
  }),
  menuList: (styles) => ({
    ...styles,
    backgroundColor: 'var(--bg)',
    borderRadius: '8px',
    padding: '0',
  }),
});

export const DropdownField = <T extends FieldValues>({
  label,
  name,
  control,
  options,
  placeholder = 'Seleccione...',
  isClearable = false,
  labelClassName,
  errorClassName,
  containerClassName,
  isRequired = false,
  rules,
  disabled = false,
  onChangeSelection,
  noOptionMessage = ({ inputValue }: { inputValue: string }) => `No hay resultados para "${inputValue}"`,
  requiredMsg,
  additionalInformation,
}: DropdownFieldProps<T>) => {
  const {
    field: { value, onChange, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      ...rules,
      required: isRequired ? requiredMsg || 'Este campo es obligatorio' : false,
    },
  });

  const handleChange = (newValue: SingleValue<Option> | MultiValue<Option>) => {
    let selectedValue: Option['value'] | '' = '';
    if (newValue && !Array.isArray(newValue)) {
      selectedValue = (newValue as Option).value;
    }
    onChange(selectedValue);
    if (onChangeSelection) onChangeSelection(selectedValue);
  };

  return (
    <div className={`w-full ${containerClassName} ${disabled ? 'cursor-not-allowed' : ''}`}>
      {label && (
        <label htmlFor={name as string} className={`text-neutral-700 ${labelClassName} block`}>
          {label}
          {isRequired && <span className="text-[var(--error)] ml-1">*</span>}
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
          <Select
            key={name}
            options={options}
            placeholder={placeholder}
            isClearable={isClearable}
            value={options.find((opt) => opt.value === value) || null}
            onChange={handleChange}
            classNamePrefix="react-select"
            styles={{
              ...customStyles(!!additionalInformation),
              menuPortal: (base) => ({ ...base, zIndex: 1050 }),
            }}
            ref={ref}
            isDisabled={disabled}
            noOptionsMessage={noOptionMessage}
            menuPortalTarget={document.body}
            menuPosition="absolute"
          />
        </div>
      </div>

      {error && (
        <span className={`text-[var(--error)] text-xs mt-1 ${errorClassName}`}>
          <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
          {error.message}
        </span>
      )}
    </div>
  );
};
