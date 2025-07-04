import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
  FaChevronDown,
  FaChevronRight,
  FaChevronUp,
  FaEdit,
  FaExclamationTriangle,
  FaFilter,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrashAlt,
} from 'react-icons/fa';
import { tableEventEmitter } from '~/config/eventEmitter';
import { Button } from '~/form/fields';
import { CheckBoxUi } from '~/form/ui';
import { useDebounce, useMediaQuery, useQuery } from '~/hooks';

import { Loader } from './Loader';
import { Toggle } from './Toggle';

interface TableProps<T extends object> {
  columns: ColumnDef<T>[];
  fetchUrl: string;
  searchUrl?: string;
  title: React.ReactNode;
  queryParams?: Record<string, string | number | boolean>;
  filterKey?: string;
  pageKey?: string;
  sizeKey?: string;
  sortKey?: string;
  responseDataKey?: string;
  responseTotalCount?: string;
  debounceDelay?: number;
  showOptions?: boolean;
  searchable?: boolean;
  onSelectAction?: (_row: T, _index: number) => void;
  onVisualizeAction?: (_row: T, _index: number) => void;
  onDeleteAction?: (_row: T, _index: number) => void;
  statusAccessor?: string;
  onStatusChange?: (_row: T, _newStatus: 'A' | 'I') => void;
  onNewAction?: () => void;
  onDeleteMassiveAction?: (_row: T[]) => void;
  defaultPage?: number;
  defaultSize?: number;
  defaultSortQuery?: string;
  sorteable?: boolean;
  pagesToShow?: number;
  tableClassName?: string;
  rowExpand?: (_row: T) => JSX.Element;
  disableRowExpand?: (_row: T) => boolean;
  notFoundLabel?: string;
  refreshEvent?: string;
  searchPlaceholder?: string;
  autoFetch?: boolean;
  errorMessage?: string;
  errorClassName?: string;
}

/**
 * Componente de tabla que se conecta a un endpoint para obtener y mostrar datos.
 * Diseñado para funcionar con `Pageable` de Spring Boot, pero puede ser extendido
 * para soportar cualquier API.
 *
 * @template T Tipo genérico de los datos que maneja la tabla.
 *
 * @param {Array<{ header: string, accessor: keyof T }>} columns - Columnas de la tabla,
 *        donde `header` es el nombre visible y `accessor` la clave del objeto de datos.
 * @param {string} fetchUrl - URL del endpoint para obtener los datos de la tabla.
 * @param {string} searchUrl - URL del endpoint para realizar búsquedas en la tabla.
 * @param {Record<string, unknown>} [queryParams={}] - Parámetros adicionales para las consultas a la API.
 * @param {string} [title] - Título de la tabla.
 * @param {string} [filterKey='filter'] - Clave del parámetro de búsqueda en la API.
 * @param {string} [pageKey='page'] - Clave del parámetro de paginación en la API.
 * @param {string} [sizeKey='size'] - Clave del parámetro que define el tamaño de la página.
 * @param {string} [sortKey='sort'] - Clave del parámetro que define el ordenamiento.
 * @param {number} [debounceDelay=300] - Tiempo de espera en milisegundos para la búsqueda con debounce.
 * @param {string} [responseDataKey='content'] - Clave dentro de la respuesta de la API que contiene los datos.
 * @param {string} [responseTotalCount='totalElements'] - Clave dentro de la respuesta de la API que contiene la cantidad total de elementos.
 * @param {boolean} [showOptions=true] - Indica si se deben mostrar opciones en la tabla (nextPage, totalPages, etc.).
 * @param {boolean} [searchable=true] - Indica si la tabla permite búsqueda.
 * @param {(item: T) => void} [onSelectAction] - Función que se ejecuta cuando se selecciona un elemento de la tabla, si no se envía no aparece el botón de editar.
 * @param {(item: T) => void} [onVisualizeAction] - Función que se ejecuta cuando se selecciona un elemento de la tabla, si no se envía no aparece el botón de mostrar.
 * @param {(id: string | number) => void} [onDeleteAction] - Función que se ejecuta al eliminar un elemento.
 * @param {(item: T) => boolean} [statusAccessor] - Función que accede al estado de un elemento de la tabla.
 * @param {(id: string | number, newStatus: boolean) => void} [onStatusChange] - Función que se ejecuta cuando cambia el estado de un elemento.
 * @param {() => void} [onNewAction] - Función que se ejecuta al presionar el botón de "Nuevo".
 * @param {(ids: Array<string | number>) => void} [onDeleteMassiveAction] - Función para eliminar múltiples elementos a la vez.
 * @param {number} [defaultPage=0] - Página inicial por defecto.
 * @param {number} [defaultSize=5] - Cantidad de elementos por página por defecto.
 * @param {string} [defaultSortQuery=''] - Query de ordenamiento por defecto.
 * @param {boolean} [sorteable=true] - Indica si la tabla permite ordenar columnas.
 * @param {number} [pagesToShow=5] - Número de páginas visibles en la paginación.
 * @param {string} [tableClassName] - Clases CSS adicionales para la tabla.
 * @param {(rowData: T) => React.ReactNode} [rowExpand] - Función que define el contenido expandible de una fila.
 * @param {(rowData: T) => boolean} [disableRowExpand] - Función que indica si se debe deshabilitar la expansión de una fila.
 * @param {string} [notFoundLabel='No se encontraron resultados'] - Texto a mostrar cuando no hay datos en la tabla.
 * @param {any} [refreshEvent] - Evento que, cuando cambia, refresca la tabla.
 * @param {string} [searchPlaceholder='Buscar...'] - Texto del placeholder en la barra de búsqueda.
 *
 * @example
 * <QueryTable<UnidadMedida>
 *  title="Unidad de medida"
 *  columns={colums}
 *  fetchUrl={`api/${currenCodigoLicenciatario}`}
 *  filterKey="filtro"
 *  searchPlaceholder='Buscar por item o referencia.'
 * />
 */
export const QueryTable = <T extends object>({
  columns,
  fetchUrl,
  searchUrl,
  queryParams = {},
  title,
  filterKey = 'filter',
  pageKey = 'page',
  sizeKey = 'size',
  sortKey = 'sort',
  debounceDelay = 300,
  responseDataKey = 'content',
  responseTotalCount = 'totalElements',
  showOptions = true,
  searchable = true,
  onSelectAction,
  onVisualizeAction,
  onDeleteAction,
  statusAccessor,
  onStatusChange,
  onNewAction,
  onDeleteMassiveAction,
  defaultPage = 0,
  defaultSize = 5,
  defaultSortQuery = '',
  sorteable = true,
  pagesToShow = 5,
  tableClassName,
  rowExpand,
  disableRowExpand,
  notFoundLabel = 'No se encontraron resultados',
  refreshEvent,
  searchPlaceholder = 'Buscar...',
  autoFetch = true,
  errorMessage = 'Ocurrió un error al obtener los datos.',
  errorClassName = 'text-red-500',
}: TableProps<T>) => {
  const [pagination, setPagination] = useState({
    pageIndex: defaultPage,
    pageSize: defaultSize,
  });
  const prevQueryParamsRef = useRef(queryParams);
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const debouncedFilter = useDebounce(globalFilter, debounceDelay);
  const [overlayData, setOverlayData] = useState<{ row: T; buttonRect: DOMRect } | null>(null);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [showMassDeleteConfirmation, setShowMassDeleteConfirmation] = useState(false);
  const [sortQuery, setSortQuery] = useState(defaultSortQuery);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const toggleRowExpansion = (rowId: string, row: T) => {
    if (typeof disableRowExpand === 'function' && disableRowExpand(row)) return;

    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const handleRowSelection = (row: T) => {
    setSelectedRows((prevSelected) => (prevSelected.includes(row) ? prevSelected.filter((selected) => selected !== row) : [...prevSelected, row]));
  };

  const queryParamsWithPagination = {
    ...queryParams,
    [pageKey]: pagination.pageIndex,
    [sizeKey]: pagination.pageSize,
    [filterKey]: debouncedFilter,
    [sortKey]: sortQuery,
  };
  const preventEarlyQuery = JSON.stringify(queryParams) !== JSON.stringify(prevQueryParamsRef.current) && pagination.pageIndex !== 0;

  const { data, loading, error, refetch } = useQuery<(Record<string, unknown> & { content: T[]; totalElements: number }) | null>(
    fetchUrl,
    undefined,
    queryParamsWithPagination,
    !preventEarlyQuery && autoFetch,
    'network-first'
  );
  const totalPages = data ? Math.ceil((data[responseTotalCount] as number) / pagination.pageSize) : 0;

  useEffect(() => {
    setSelectedRows([]);
  }, [pagination]);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
    prevQueryParamsRef.current = queryParams;
  }, [JSON.stringify(queryParams)]);

  useEffect(() => {
    const eventName = refreshEvent || 'refreshTable';
    const listener = () => refetch('', true);
    tableEventEmitter.on(eventName, listener);

    return () => {
      tableEventEmitter.off(eventName, listener);
    };
  }, [refetch, refreshEvent]);

  useEffect(() => {
    setExpandedRows({});
    setSelectedRows([]);

    if (searchUrl) {
      refetch(searchUrl);
    }
  }, [globalFilter]);

  const handleDeleteClick = (row: T, buttonRect: DOMRect) => {
    setOverlayData({ row, buttonRect });
  };

  const handleSort = (columnId: string, sorter: string) => {
    setExpandedRows({});
    setPagination({ ...pagination, pageIndex: 0 });
    setSortQuery(`${columnId.replaceAll('_', '.')},${sorter}`);
  };

  const confirmDelete = async () => {
    if (overlayData && onDeleteAction) {
      const currentData = Array.isArray(data?.[responseDataKey]) ? (data?.[responseDataKey] as T[]) : [];
      const rowIndex = currentData.indexOf(overlayData.row);
      await onDeleteAction(overlayData.row, rowIndex);
      refetch('', true);
    }
    setOverlayData(null);
  };

  const cancelDelete = () => {
    setOverlayData(null);
  };

  const handleStatusToggle = async (row: T) => {
    if (!statusAccessor || !onStatusChange) return;

    if (!data) return;
    data[responseDataKey] = (data[responseDataKey] as T[]).map((item) =>
      item === row ? { ...item, [statusAccessor]: (item[statusAccessor as keyof T] === 'A' ? 'I' : 'A') as T[keyof T] } : item
    );

    // Obtiene el nuevo estado de manera segura
    const newStatus = (row[statusAccessor as keyof T] === 'A' ? 'I' : 'A') as T[keyof T];

    // Llama a onStatusChange con el nuevo estado
    await onStatusChange(row, newStatus as 'A' | 'I');
  };

  // TODO: implementar diseño para seleccionar todos los registros
  // const handleSelectAll = () => {
  //   setSelectedRows(selectedRows.length === table.getRowModel().rows.length ? [] : table.getRowModel().rows.map((row) => row.original));
  // };

  const renderPaginationButtons = () => {
    const { pageIndex } = pagination;
    const maxPagesToShow = !isMobile ? pagesToShow : 3;
    let startPage = Math.max(0, pageIndex - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
      <button
        type="button"
        key={page}
        onClick={() => {
          setPagination({ ...pagination, pageIndex: page });
          setExpandedRows({});
        }}
        className={`px-3 py-1 rounded-md text-[var(--font)] ${page === pageIndex ? 'bg-[var(--secondaryalt)] ' : 'bg-[var(--bg)] hover:bg-[var(--disabled)]'}`}
      >
        {page + 1}
      </button>
    ));
  };

  const confirmMassDelete = async () => {
    if (onDeleteMassiveAction) {
      await onDeleteMassiveAction(selectedRows);
      refetch('', true);
    }
    setSelectedRows([]);
    setShowMassDeleteConfirmation(false);
  };

  const selectionColumn: ColumnDef<T> = {
    id: 'selection',
    meta: { className: 'w-[1%]' },
    header: () => (
      <div className="flex">
        <button
          type="button"
          onClick={() => setShowMassDeleteConfirmation(true)}
          className={`p-1 rounded-md text-[var(--error)] hover:text-red-600 ${selectedRows.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Eliminar seleccionados"
          disabled={selectedRows.length === 0}
        >
          <FaTrashAlt className="text-lg" />
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <CheckBoxUi className="accent-border-dark" checked={selectedRows.includes(row.original)} onChange={() => handleRowSelection(row.original)} />
    ),
  };

  const actionColumn: ColumnDef<T> = {
    id: 'actions',
    header: () => 'Acciones',
    meta: { className: 'w-[10%]' },
    cell: ({ row }) => (
      <div className="flex items-center justify-center space-x-2 relative">
        {onVisualizeAction && (
          <button type="button" onClick={() => onVisualizeAction(row.original, row.index)} className="text-neutral-700 hover:text-neutral-900" title="Editar">
            <FaSearch className="text-lg" />
          </button>
        )}
        {onSelectAction && (
          <button type="button" onClick={() => onSelectAction(row.original, row.index)} className="text-blue-500 hover:text-[var(--info)]" title="Editar">
            <FaEdit className="text-lg" />
          </button>
        )}
        {onDeleteAction && (
          <button
            type="button"
            onClick={(e) => {
              const buttonRect = (e.target as HTMLButtonElement).getBoundingClientRect();
              handleDeleteClick(row.original, buttonRect);
            }}
            className="text-red-500 hover:text-[var(--error)]"
            title="Eliminar"
          >
            <FaTrashAlt className="text-lg" />
          </button>
        )}
      </div>
    ),
  };

  const tableColumns = [
    ...(onDeleteMassiveAction ? [selectionColumn] : []),
    ...(onSelectAction || onVisualizeAction || onDeleteAction ? [actionColumn] : []),
    ...columns,
  ].filter((column) => column.id !== 'selection' || onDeleteMassiveAction);

  const table = useReactTable<T>({
    data: Array.isArray(data?.[responseDataKey]) ? (data?.[responseDataKey] as T[]) : [],
    columns: tableColumns,
    pageCount: totalPages,
    state: { pagination, globalFilter },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  return (
    <div className={`flex flex-col ${tableClassName ?? ''}`}>
      {/* Encabezado con búsqueda y botón de agregar */}
      <div className="flex flex-wrap justify-between items-center mb-4 px-4 py-2 bg-[var(--bg)] border-b border-[var(--border)] rounded-t-lg">
        <p className="text-lg font-bold text-[var(--font)] break-words">{title}</p>

        <div className="flex items-center space-x-2 w-full sm:w-auto mt-2 sm:mt-0">
          {searchable && (
            <div className="relative flex items-center border border-[var(--border)] rounded bg-[var(--bg)] focus-within:ring focus-within:border-[var(--highlight)]">
              <span className="px-3 text-[var(--placeholder)]">
                <FaFilter />
              </span>
              <input
                type="text"
                value={globalFilter ?? ''}
                onChange={(e) => {
                  setGlobalFilter(e.target.value);
                  setPagination({ ...pagination, pageIndex: 0 });
                }}
                placeholder={searchPlaceholder}
                className="flex-1 p-2 bg-transparent text-[var(--font)] placeholder-[var(--placeholder)] focus:outline-none w-[25%]"
              />
              {globalFilter && (
                <button
                  type="button"
                  onClick={() => setGlobalFilter('')}
                  className="absolute right-2 text-[var(--placeholder)] hover:text-[var(--font)] focus:outline-none"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          )}

          {onNewAction && (
            <button type="button" onClick={onNewAction} className="p-3 bg-[var(--info)] text-white rounded hover:bg-blue-400">
              <FaPlus />
            </button>
          )}
        </div>
      </div>

      {/* Tabla con scroll horizontal */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border)] shadow-md">
        <table className="min-w-full bg-[var(--bg)] text-[var(--font)] text-left">
          <thead className="border-b bg-[var(--secondaryalt)] text-[var(--font)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {rowExpand && <th className="px-4 py-4 text-sm font-medium border-[var(--border)]"></th>}
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-4 py-3 text-sm font-semibold border-[var(--border)] whitespace-nowrap ${(header.column.columnDef.meta as Record<string, unknown>)?.className || ''}`}
                  >
                    {header.isPlaceholder ? null : header.id !== 'selection' && header.id !== 'actions' ? (
                      <div className="group flex justify-center items-center space-x-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sorteable && header.column.columnDef.enableSorting !== false && (
                          <div className="flex flex-col">
                            <FaChevronUp
                              className={`cursor-pointer text-xs ml-2 text-[var(--font)] hover:text-[var(--disabled)]`}
                              onClick={() => handleSort(header.id, 'asc')}
                            />
                            <FaChevronDown
                              className={`-mt-[3px] cursor-pointer text-xs ml-2 text-[var(--font)] hover:text-[var(--disabled)]`}
                              onClick={() => handleSort(header.id, 'desc')}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">{flexRender(header.column.columnDef.header, header.getContext())}</div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {error ? (
              <tr className="border-b border-[var(--border)]">
                <td
                  colSpan={tableColumns.length + (rowExpand ? 1 : 0) + (onDeleteAction || onSelectAction || onVisualizeAction ? 1 : 0)}
                  className={`text-center py-4 text-[var(--error)] font-medium ${errorClassName}`}
                >
                  {errorMessage}
                </td>
              </tr>
            ) : loading ? (
              <tr className="border-b border-[var(--border)]">
                <td
                  colSpan={tableColumns.length + (rowExpand ? 1 : 0) + (onDeleteAction || onSelectAction || onVisualizeAction ? 1 : 0)}
                  className="text-center py-4"
                >
                  <Loader className="text-[var(--secondary)]" />
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr className="border-b border-[var(--border)]">
                <td
                  colSpan={tableColumns.length + (rowExpand ? 1 : 0) + (onDeleteAction || onSelectAction || onVisualizeAction ? 1 : 0)}
                  className="text-center py-4 text-[var(--font)] font-medium"
                >
                  {notFoundLabel}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr key={row.id} className="border-b border-[var(--border)] text-center hover:bg-[var(--secondaryalthover)] transition duration-200">
                    {rowExpand && (
                      <td className="whitespace-nowrap px-2 py-4 text-sm font-light border-[var(--border)]">
                        <button
                          type="button"
                          onClick={() => toggleRowExpansion(row.id, row.original)}
                          className={`focus:outline-none transition-transform duration-300 flex items-center justify-center
                            ${
                              typeof disableRowExpand === 'function' && disableRowExpand(row.original)
                                ? 'cursor-not-allowed text-[var(--disabled)] opacity-50'
                                : 'cursor-pointer hover:text-[var(--hover)]'
                            }`}
                          disabled={typeof disableRowExpand === 'function' && disableRowExpand(row.original)}
                        >
                          <span className={`inline-block transition-transform duration-300 ${expandedRows[row.id] ? 'rotate-90' : 'rotate-0'}`}>
                            <FaChevronRight />
                          </span>
                        </button>
                      </td>
                    )}
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta as Record<string, unknown> | undefined;
                      const customClass = typeof meta?.className === 'string' ? meta.className : '';
                      const whitespaceClass = customClass.includes('whitespace-normal') ? '' : 'whitespace-nowrap';

                      if (statusAccessor && cell.column.id === statusAccessor) {
                        const status = cell.getValue() as 'A' | 'I';
                        return (
                          <td key={cell.id} className={`px-6 py-4 text-sm font-light border-[var(--border)] ${whitespaceClass} ${customClass}`}>
                            <div className="flex items-center justify-center">
                              <Toggle isActive={status === 'A'} onToggle={() => handleStatusToggle(row.original)} />
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td key={cell.id} className={`px-6 py-4 text-sm font-light border-[var(--border)] ${whitespaceClass} ${customClass}`}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                  {expandedRows[row.id] && rowExpand && (
                    <tr className="border-b">
                      <td colSpan={columns.length + 3} className="p-4 text-left bg-[var(--bg)] relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--border)]" />
                        <div className="ml-8">{rowExpand(row.original)}</div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {showOptions && (
        <div className="flex justify-center items-center mt-4 space-x-2 flex-wrap">
          {/* Información de registros */}
          <div className="flex items-center space-x-2 py-2">
            <span className="text-[var(--font)] text-sm text-center md:text-left align-middle">
              Mostrando del registro {data?.[responseTotalCount] === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1} al{' '}
              {Math.min((pagination.pageIndex + 1) * pagination.pageSize, typeof data?.[responseTotalCount] === 'number' ? data[responseTotalCount] : 0)} de{' '}
              {String(data?.[responseTotalCount] ?? 0)}
            </span>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setPagination({ ...pagination, pageIndex: 0 });
                setExpandedRows({});
              }}
              disabled={pagination.pageIndex === 0}
              className="px-3 py-1 bg-[var(--bg)] rounded-md hover:bg-[var(--disabled)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaAngleDoubleLeft className="text-[var(--font)]" />
            </button>
            <button
              type="button"
              onClick={() => {
                setPagination({ ...pagination, pageIndex: Math.max(0, pagination.pageIndex - 1) });
                setExpandedRows({});
              }}
              disabled={pagination.pageIndex === 0}
              className="px-3 py-1 bg-[var(--bg)] rounded-md hover:bg-[var(--disabled)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaAngleLeft className="text-[var(--font)]" />
            </button>
            {renderPaginationButtons()}
            <button
              type="button"
              onClick={() => {
                setPagination({ ...pagination, pageIndex: Math.min(totalPages - 1, pagination.pageIndex + 1) });
                setExpandedRows({});
              }}
              disabled={pagination.pageIndex === totalPages - 1}
              className="px-3 py-1 bg-[var(--bg)] rounded-md hover:bg-[var(--disabled)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaAngleRight className="text-[var(--font)]" />
            </button>
            <button
              type="button"
              onClick={() => {
                setPagination({ ...pagination, pageIndex: totalPages - 1 });
                setExpandedRows({});
              }}
              disabled={pagination.pageIndex === totalPages - 1}
              className="px-3 py-1 bg-[var(--bg)] rounded-md hover:bg-[var(--disabled)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaAngleDoubleRight className="text-[var(--font)]" />
            </button>
          </div>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="ml-2 p-2 bg-[var(--secondaryalt)] text-[var(--font)] rounded md:mt-0 mt-3"
          >
            {[5, 10, 20].map((pageSize) => (
              <option key={pageSize} value={pageSize} className="hover:bg-[var(--secondaryalthover)]">
                Mostrar {pageSize}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Overlay eliminacion individual */}
      {overlayData && (
        <motion.div
          className="fixed z-50 bg-[var(--bg)] border border-[var(--border)] rounded shadow-lg p-4"
          style={{
            top: overlayData.buttonRect.bottom + window.scrollY + 10,
            left: overlayData.buttonRect.left + overlayData.buttonRect.width / 2,
            transform: 'translateX(-50%)',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="flex items-center space-x-2">
            <FaExclamationTriangle className="text-[var(--error)] text-xl" />
            <p className="text-sm text-[var(--font)]">¿Estás seguro de eliminar este elemento?</p>
          </div>
          <div className="flex justify-end space-x-4  mt-4">
            <Button type="button" variant="primary" onClick={confirmDelete} className="px-4 py-2 bg-red-500 rounded hover:bg-red-600">
              Sí
            </Button>
            <Button type="button" variant="outline" onClick={cancelDelete} className="px-4 py-2 rounded">
              No
            </Button>
          </div>
        </motion.div>
      )}

      {/* Modal de eliminación masiva */}
      {showMassDeleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            className="bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg p-6 w-[90%] sm:w-[400px] max-w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center space-x-2">
              <FaExclamationTriangle className="text-[var(--error)] text-2xl" />
              <p className="text-md text-[var(--font)]">¿Estás seguro de eliminar los elementos seleccionados?</p>
            </div>

            <div className="flex flex-wrap justify-end space-x-2 sm:space-x-4 mt-6">
              <Button type="button" variant="primary" onClick={confirmMassDelete} className="px-4 py-2 bg-red-500 rounded hover:bg-red-600">
                Sí
              </Button>
              <Button variant="outline" type="button" onClick={() => setShowMassDeleteConfirmation(false)} className="px-4 py-2 rounded">
                No
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
