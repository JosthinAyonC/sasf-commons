import React from 'react';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import ReactInputColor from 'react-input-color';

import { TextFieldUI } from '../ui/TextFieldUi';
import { ColorPickerFieldProps } from './types';

export const ColorPickerField = <T extends FieldValues>({
  label,
  name,
  labelClassName,
  inputClassName,
  isRequired = false,
  onChange,
}: ColorPickerFieldProps<T>) => {
  const { control, watch } = useFormContext<T>();
  const color = watch(name) || '#ffffff';

  return (
    <div className="relative w-full">
      <style>
        {`.css-1yn2e29-InputColor{
            padding: 1px;
            background-color: var(--border);
          }`}
      </style>
      {label && (
        <label htmlFor={name} className={`block mb-1 text-[var(--font)] ${labelClassName}`}>
          {label}
          {isRequired && <span className="text-[var(--error)] ml-1">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange: onChangeForm } }) => (
          <>
            <div className="flex items-center space-x-2">
              <ReactInputColor
                initialValue={color}
                onChange={(value) => {
                  onChangeForm(value.hex);
                  if (onChange) {
                    onChange(value.hex);
                  }
                }}
                placement="right"
              />
              <TextFieldUI
                type="text"
                value={color}
                onChange={(value) => {
                  onChangeForm(value);
                }}
                inputClassName={inputClassName}
              />
            </div>
          </>
        )}
      />
    </div>
  );
};
