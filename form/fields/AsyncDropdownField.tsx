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

/**
 * Componente `AsyncDropdown` que proporciona un dropdown asincrónico con paginación y búsqueda.
 * Diseñado para integrarse con `react-hook-form` y utilizar un backend que soporte paginación
 * (por ejemplo, un endpoint con `page`, `size` y filtro por query param).
 *
 * Nota muy importante: Para que el componente funcione correctamente debemos tener el endpoint que devuelve el
 * registro por id especificamente.
 *
 * En ocasiones bastara setearle el codigo correspondiente y automaticamente se cargara el registro, pero esto
 * solo sucederá cuando el registro seleccionado este entre los primero 10 registros que devuelve el endpoint.
 *
 * Este componente también puede pre-cargar una opción si se proporciona `fetchByIdUrl`.
 *
 * @template FieldValues - Tipo genérico que representa el formulario que representa..
 * @template T - Tipo genérico que representa el objeto que retorna el endpoint.
 *
 * @param {string} name - Nombre del campo en el formulario (clave que usa `react-hook-form`).
 * @param {string} label - Etiqueta mostrada encima del campo.
 * @param {boolean} [isRequired=false] - Indica si el campo es obligatorio.
 * @param {string} [placeholder='Seleccione...'] - Texto a mostrar cuando no hay selección.
 * @param {string} fetchUrl - URL del endpoint para obtener las opciones del dropdown.
 * @param {string} [fetchByIdUrl] - URL opcional para cargar una opción por ID al montar el componente.
 * @param {string} [queryParamFilter='filtro'] - Nombre del parámetro de búsqueda para el backend.
 * @param {(item: T) => Option} transformOption - Función que transforma cada ítem recibido del backend en una opción para el dropdown.
 * @param {(context: { inputValue: string }) => string} [noOptionMessage] - Mensaje mostrado cuando no hay opciones para un input dado.
 * @param {string} [requiredMsg='Este campo es obligatorio'] - Mensaje de error mostrado si el campo es requerido y está vacío.
 * @param {boolean} [disabled=false] - Indica si el campo está deshabilitado.
 * @param {boolean} [isClearable=false] - Indica si se puede limpiar la selección.
 * @param {string} [labelClassName] - Clases CSS adicionales para el label.
 * @param {string} [containerClassName] - Clases CSS adicionales para el contenedor principal.
 * @param {string} [selectClassName] - Clases CSS adicionales para el componente Select.
 * @param {string} [errorClassName] - Clases CSS adicionales para el mensaje de error.
 * @param {string | React.ReactNode} [additionalInformation] - Información adicional mostrada con ícono de ayuda.
 * @param {Record<string, string | number>} [queryParams] - Parámetros adicionales para la consulta al backend.
 *
 * @returns {JSX.Element} Componente de dropdown asíncrono con búsqueda y paginación.
 *
 * @example
 * <AsyncDropdown<ClienteFormType, ClienteType>
 *   name="cliente"
 *   label="Cliente"
 *   fetchUrl="domain/api/clientes"
 *   fetchByIdUrl="domain/api/clientes/123"
 *   transformOption={(cliente) => ({ value: cliente.id, label: cliente.nombre })}
 *   queryParams={{ estado: 'A' }}
 *   isRequired
 * />
 */
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
  noOptionMessage = ({ inputValue }: { inputValue: string }) => {
    return inputValue ? `No hay resultados para "${inputValue}"` : 'No hay opciones disponibles';
  },
  requiredMsg = 'Este campo es obligatorio',
  disabled = false,
  isClearable = false,
  additionalInformation,
  fetchByIdUrl,
  queryParams,
  onChangeSelection,
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

  const { data, loading } = useQuery<{ content: T[] }>({
    url: fetchUrl,
    queryParams: {
      ...queryParams,
      [queryParamFilter]: debouncedInput,
      page,
      size: 10,
    },
  });

  const { data: dataById } = useQuery<T>({ url: fetchByIdUrl ?? '', autoFetch: !!fetchByIdUrl });

  const handleChange = (newValue: SingleValue<Option> | MultiValue<Option>) => {
    let selectedValue: Option['value'] | '' = '';
    if (newValue && !Array.isArray(newValue)) {
      selectedValue = (newValue as Option).value;
    }
    onChange(selectedValue);
    if (onChangeSelection) onChangeSelection(data?.content.find((item) => transformOption(item).value === selectedValue) as T);
  };

  useEffect(() => {
    if (dataById) {
      const transformedOption = transformOption(dataById);
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

    // Si lees este comentario, quiero que sepas que este cambio me causo un dolor de cabeza horrible
    setOptions((prev) => {
      const getKey = (value: Option['value']) => (typeof value === 'object' ? JSON.stringify(value) : String(value));

      const uniqueOptions = new Map<string, Option>();

      prev.forEach((opt) => uniqueOptions.set(getKey(opt.value), opt));

      newOptions.forEach((opt) => {
        const key = getKey(opt.value);
        if (!uniqueOptions.has(key)) {
          uniqueOptions.set(key, opt);
        }
      });

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
