import React from 'react';
import { FieldError, FieldValues, useFormContext } from 'react-hook-form';

import { SelectFieldProps } from './types';

export const SelectField = <T extends FieldValues>({
  label,
  name,
  labelClassName,
  selectClassName,
  errorClassName,
  options,
  isRequired,
  onChange,
}: Omit<SelectFieldProps<T>, 'register' | 'error'> & { onChange?: (_event: React.ChangeEvent<HTMLSelectElement>) => void }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name] as FieldError | undefined;

  return (
    <div>
      {label && (
        <label htmlFor={name as string} className={`text-[var(--font)] ${labelClassName} block`}>
          {label}
        </label>
      )}
      <select
        id={name as string}
        {...register(name, { required: isRequired ? 'Este campo es obligatorio' : undefined })}
        className={`border border-[var(--border)] bg-[var(--bg)] text-[var(--font)] rounded-md p-2 w-full focus:border-[var(--primary)] ${selectClassName}`}
        onChange={onChange}
      >
        <option value="">{(options?.length ?? 0) > 0 ? 'Selecciona una opción' : 'No se encontraron opciones para mostrar'}</option>
        {options &&
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
      {error && <span className={`text-[var(--error)] ${errorClassName}`}>{error.message}</span>}
    </div>
  );
};
