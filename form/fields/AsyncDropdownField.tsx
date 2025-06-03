import { faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { FieldValues, useController } from 'react-hook-form';
import Select from 'react-select';
import type { SingleValue } from 'react-select';
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
 * Este componente también puede pre-cargar una opción si se proporciona `fetchByIdUrl`.
 *
 * @template T - Tipo genérico que representa el objeto que retorna el endpoint.
 *
 * @param {string} name - Nombre del campo en el formulario (clave que usa `react-hook-form`).
 * @param {string} label - Etiqueta mostrada encima del campo.
 * @param {boolean} [isRequired=false] - Indica si el campo es obligatorio.
 * @param {string} [placeholder='Seleccione...'] - Texto a mostrar cuando no hay selección.
 * @param {string} fetchUrl - URL del endpoint para obtener las opciones del dropdown.
 * @param {string} [fetchByIdUrl] - URL opcional para cargar una opción por ID al montar el componente.
 * @param {string} [queryParamName='filtro'] - Nombre del parámetro de búsqueda para el backend.
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
 *
 * @returns {JSX.Element} Componente de dropdown asíncrono con búsqueda y paginación.
 *
 * @example
 * <AsyncDropdown<Cliente>
 *   name="cliente"
 *   label="Cliente"
 *   fetchUrl="domain/api/clientes"
 *   fetchByIdUrl="domain/api/clientes/123"
 *   transformOption={(cliente) => ({ value: cliente.id, label: cliente.nombre })}
 *   isRequired
 * />
 */
export function AsyncDropdown<T extends FieldValues>({
  name,
  label,
  isRequired = false,
  placeholder = 'Seleccione...',
  fetchUrl,
  labelClassName = '',
  containerClassName = '',
  selectClassName = '',
  errorClassName = '',
  queryParamName = 'filtro',
  transformOption,
  noOptionMessage = ({ inputValue }: { inputValue: string }) => `No hay resultados para "${inputValue}"`,
  requiredMsg = 'Este campo es obligatorio',
  disabled = false,
  isClearable = false,
  additionalInformation,
  fetchByIdUrl,
}: AsyncDropdownProps<T>) {
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
      [queryParamName]: debouncedInput,
      page,
      size: 10,
    },
  });

  const { data: dataById } = useQuery<T>({ url: fetchByIdUrl ?? '', autoFetch: !!fetchByIdUrl });

  useEffect(() => {
    if (dataById) {
      const transformedOption = transformOption(dataById);
      onChange(transformedOption);
    }
  }, [dataById]);

  useEffect(() => {
    if (!data) return;
    const newOptions = data.content.map(transformOption);
    setOptions((prev) => (page === 0 ? newOptions : [...prev, ...newOptions]));
    setHasMore(data.content.length === 10);
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [debouncedInput]);

  return (
    <div className={`w-full ${containerClassName}`}>
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
            placeholder={placeholder}
            value={value}
            onChange={(newValue) => onChange(newValue as SingleValue<Option>)}
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
              ...customStyles(!!additionalInformation),
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
