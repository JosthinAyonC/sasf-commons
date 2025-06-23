import { faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { FieldValues, useController } from 'react-hook-form';
import Select from 'react-select';
import type { MultiValue, SingleValue } from 'react-select';
import { PortalTooltip } from '~/components/ui/PortalTooltip';
import { useDebounce } from '~/hooks';
import { useQuery } from '~/hooks/useQuery';

import { customStyles } from './DropdownField';
import { AsyncDropdownProps, Option } from './types';

export function AsyncDropdown<FormValues extends FieldValues, T>({
  name,
  label,
  isRequired = false,
  placeholder = 'Seleccione...',
  fetchUrl,
  labelClassName = '',
  containerClassName = '',
  selectClassName = '',
  errorClassName = '',
  queryParamFilter = 'filtro',
  transformOption,
  noOptionMessage = ({ inputValue }: { inputValue: string }) => (inputValue ? `No hay resultados para "${inputValue}"` : 'No hay opciones disponibles'),
  requiredMsg = 'Este campo es obligatorio',
  disabled = false,
  isClearable = false,
  additionalInformation,
  fetchByIdUrl,
  queryParams,
  onChangeSelection,
  autoFetch = true,
  dropdownRef,
}: AsyncDropdownProps<FormValues, T>) {
  const {
    field: { value, onChange, ref },
    fieldState: { error },
  } = useController({ name, rules: isRequired ? { required: requiredMsg } : undefined });

  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(0);
  const [options, setOptions] = useState<Option[]>([]);
  const debouncedInput = useDebounce(inputValue, 300);
  const [hasMore, setHasMore] = useState(true);

  const { data, loading, refetch } = useQuery<{ content: T[] }>({
    url: fetchUrl,
    queryParams: {
      ...queryParams,
      [queryParamFilter]: debouncedInput,
      page,
      size: 10,
    },
    autoFetch: !!fetchUrl && autoFetch,
  });

  const { data: dataById } = useQuery<T>({ url: fetchByIdUrl ?? '', autoFetch: !!fetchByIdUrl && autoFetch });

  const queryParamsHash = JSON.stringify(queryParams);

  useEffect(() => {
    setOptions([]);
    setPage(0);
  }, [queryParamsHash]);

  useEffect(() => {
    if (dropdownRef) {
      dropdownRef.current = {
        refetch: () => {
          refetch('', true);
        },
      };
    }
  }, [refetch]);

  const handleChange = (newValue: SingleValue<Option> | MultiValue<Option>) => {
    let selectedValue: Option['value'] | '' = '';
    if (newValue && !Array.isArray(newValue)) {
      selectedValue = (newValue as Option).value;
    }
    onChange(selectedValue);
    if (onChangeSelection) {
      onChangeSelection(data?.content.find((item) => transformOption(item).value === selectedValue) as T);
    }
  };

  useEffect(() => {
    if (dataById) {
      const transformedOption = {
        ...transformOption(dataById),
        __fromById: true, // Marca que este viene del fetchById
      } as Option & { __fromById: true };

      setOptions((prev) => {
        const exists = prev.find((opt) => opt.value === transformedOption.value);
        return exists ? prev : [transformedOption, ...prev];
      });

      onChange(transformedOption.value);
    }
  }, [dataById]);

  useEffect(() => {
    if (!data) return;

    const newOptions = data.content.map(transformOption);

    setOptions((prev) => {
      const getKey = (value: Option['value']) => (typeof value === 'object' ? JSON.stringify(value) : String(value));

      let combinedOptions = newOptions;

      if (page === 0) {
        const byIdOption = prev.find(
          (opt) =>
            '__fromById' in opt &&
            (opt as Option & { __fromById?: boolean }).__fromById &&
            !newOptions.some((newOpt) => getKey(newOpt.value) === getKey(opt.value))
        );

        if (byIdOption) {
          combinedOptions = [byIdOption, ...newOptions];
        }

        return combinedOptions;
      }

      const uniqueOptions = new Map<string, Option>();
      prev.forEach((opt) => uniqueOptions.set(getKey(opt.value), opt));
      newOptions.forEach((opt) => uniqueOptions.set(getKey(opt.value), opt));

      return Array.from(uniqueOptions.values());
    });

    setHasMore(data.content.length === 10);
  }, [data, page, transformOption]);

  useEffect(() => {
    setPage(0);
  }, [debouncedInput]);

  const aditionalInformationValue = additionalInformation ? additionalInformation(options) : undefined;

  return (
    <div className={`w-full ${containerClassName} ${disabled ? 'cursor-not-allowed' : ''}`}>
      {label && (
        <label htmlFor={name as string} className={`text-neutral-700 ${labelClassName} block`}>
          {label}
          {isRequired && <span className="text-[var(--error)] ml-1">*</span>}
        </label>
      )}
      <div className="flex w-full">
        {aditionalInformationValue && (
          <div className="relative flex items-center justify-center w-[10%] bg-[var(--bg)] border border-r-0 border-[var(--border)] rounded-l-md">
            <PortalTooltip content={aditionalInformationValue}>
              <FontAwesomeIcon icon={faInfoCircle} className="text-[var(--info)] cursor-pointer" />
            </PortalTooltip>
          </div>
        )}
        <div className={`${aditionalInformationValue ? 'w-[90%]' : 'w-full'}`}>
          <Select<Option, false>
            placeholder={placeholder}
            value={options.find((opt) => opt.value === value) || null}
            onChange={handleChange}
            onInputChange={(val) => setInputValue(val)}
            options={options}
            isLoading={loading}
            isClearable={isClearable}
            noOptionsMessage={noOptionMessage}
            classNamePrefix="react-select"
            onMenuScrollToBottom={() => {
              if (!loading && hasMore) {
                setPage((prev) => prev + 1);
              }
            }}
            className={selectClassName}
            styles={{
              ...customStyles(!!aditionalInformationValue),
              menuPortal: (base) => ({ ...base, zIndex: 1050 }),
            }}
            ref={ref}
            isDisabled={disabled}
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
}
