import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
  FaChevronDown,
  FaEdit,
  FaExclamationTriangle,
  FaFilter,
  FaPlus,
  FaTimes,
  FaTrashAlt,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { tableEventEmitter } from '~/config/eventEmitter';
import { useMediaQuery } from '~/hooks';
import useDebounce from '~/hooks/useDebounce';
import { RootState } from '~/store';

import { Loader } from './Loader';
import Toggle from './Toggle';

interface TableProps<T extends object> {
  columns: ColumnDef<T>[];
  fetchUrl: string;
  title: string;
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
  onSelectAction?: (_row: T) => void;
  onDeleteAction?: (_row: T) => void;
  statusAccessor?: string;
  onStatusChange?: (_row: T, _newStatus: 'A' | 'I') => void;
  onNewAction?: () => void;
  onDeleteMassiveAction?: (_row: T[]) => void;
  defaultPage?: number;
  defaultSize?: number;
}

/**
 * Este componente es una tabla que se conecta a un endpoint para obtener los datos a mostrar.
 * funciona para cruds sencillos, para tablas más complejas que mapeen relaciones
 * Lo recomendado es instalar prime react y usar sus componentes
 * Mapeando su lógica dentro del mismo componente.
 */
const QueryTable = <T extends object>({
  columns,
  fetchUrl,
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
  onDeleteAction,
  statusAccessor,
  onStatusChange,
  onNewAction,
  onDeleteMassiveAction,
  defaultPage = 0,
  defaultSize = 5,
}: TableProps<T>) => {
  const [pagination, setPagination] = useState({
    pageIndex: defaultPage,
    pageSize: defaultSize,
  });

  const [globalFilter, setGlobalFilter] = useState('');
  const debouncedFilter = useDebounce(globalFilter, debounceDelay);
  const [fetchedData, setFetchedData] = useState<(Record<string, unknown> & { content: T[]; totalElements: number }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overlayData, setOverlayData] = useState<{ row: T; buttonRect: DOMRect } | null>(null);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [showMassDeleteConfirmation, setShowMassDeleteConfirmation] = useState(false);
  const [sortQuery, setSortQuery] = useState(``);

  const handleRowSelection = (row: T) => {
    setSelectedRows((prevSelected) => (prevSelected.includes(row) ? prevSelected.filter((selected) => selected !== row) : [...prevSelected, row]));
  };

  const totalPages = fetchedData ? Math.ceil((fetchedData[responseTotalCount] as number) / pagination.pageSize) : 0;
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const queryParamsWithPagination = {
      ...queryParams,
      [pageKey]: pagination.pageIndex,
      [sizeKey]: pagination.pageSize,
      [filterKey]: debouncedFilter,
    };

    const queryString = new URLSearchParams(
      Object.entries(queryParamsWithPagination).reduce(
        (acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        },
        {} as Record<string, string>
      )
    ).toString();

    const url = `${fetchUrl}?${queryString}&${sortKey}=${sortQuery}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setFetchedData(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, pagination, debouncedFilter, filterKey, token, sortQuery, sortKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const listener = () => fetchData();
    tableEventEmitter.on('refreshTable', listener);

    return () => {
      tableEventEmitter.off('refreshTable', listener);
    };
  }, [fetchData]);

  const handleDeleteClick = (row: T, buttonRect: DOMRect) => {
    setOverlayData({ row, buttonRect });
  };

  const handleSort = (columnId: string) => {
    setPagination({ ...pagination, pageIndex: 0 });
    setSortQuery(columnId.replaceAll('_', '.'));
  };

  const confirmDelete = async () => {
    if (overlayData && onDeleteAction) {
      await onDeleteAction(overlayData.row);
      fetchData();
    }
    setOverlayData(null);
  };

  const cancelDelete = () => {
    setOverlayData(null);
  };

  const handleStatusToggle = async (row: T) => {
    if (!statusAccessor || !onStatusChange) return;

    setFetchedData((prevData) => {
      if (!prevData) return prevData;

      const updatedContent = (prevData[responseDataKey] as T[]).map((item) =>
        item === row ? { ...item, [statusAccessor]: (item[statusAccessor as keyof T] === 'A' ? 'I' : 'A') as T[keyof T] } : item
      );

      return { ...prevData, [responseDataKey]: updatedContent };
    });

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
    const maxPagesToShow = isDesktop ? 5 : 3;
    let startPage = Math.max(0, pageIndex - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
      <button
        key={page}
        onClick={() => setPagination({ ...pagination, pageIndex: page })}
        className={`px-3 py-1 rounded-md ${
          page === pageIndex ? 'bg-[var(--secondary)] text-[var(--font)]' : 'bg-[var(--bg)] text-gray-700 hover:bg-[var(--hover2)]'
        }`}
      >
        {page + 1}
      </button>
    ));
  };

  const confirmMassDelete = async () => {
    if (onDeleteMassiveAction) {
      await onDeleteMassiveAction(selectedRows); // Espera la finalización
      fetchData(); // Ahora se ejecuta solo cuando la mutación se completa
    }
    setSelectedRows([]);
    setShowMassDeleteConfirmation(false);
  };

  const selectionColumn: ColumnDef<T> = {
    id: 'selection',
    header: () => (
      <div className="flex">
        <button
          onClick={() => setShowMassDeleteConfirmation(true)}
          className={`p-2 rounded-md bg-[var(--hover2)] text-[var(font)] hover:text-[var(--error)] ${selectedRows.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Eliminar seleccionados"
          disabled={selectedRows.length === 0}
        >
          <FaTrashAlt className="lg" />
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={selectedRows.includes(row.original)}
        onChange={() => handleRowSelection(row.original)}
        className="border border-[var(--border)] accent-[var(--secondary)] rounded-sm focus:ring-[var(--focus)] focus:outline-none bg-[var(--bg)] text-[var(--primary)] cursor-pointer scale-150"
      />
    ),
  };

  const actionColumn: ColumnDef<T> = {
    id: 'actions',
    header: () => 'Acciones',
    cell: ({ row }) => (
      <div className="flex items-center justify-center space-x-2 relative">
        {onSelectAction && (
          <button onClick={() => onSelectAction(row.original)} className="text-blue-500 hover:text-[var(--info)]" title="Editar">
            <FaEdit className="text-lg" />
          </button>
        )}
        {onDeleteAction && (
          <button
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

  const tableColumns = [selectionColumn, ...(onSelectAction || onDeleteAction ? [actionColumn] : []), ...columns];

  const table = useReactTable<T>({
    data: Array.isArray(fetchedData?.[responseDataKey]) ? (fetchedData?.[responseDataKey] as T[]) : [],
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
    <div className="flex flex-col overflow-hidden p-2">
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
                placeholder="Buscar..."
                className="flex-1 p-2 bg-transparent text-[var(--font)] placeholder-[var(--placeholder)] focus:outline-none w-[25%]"
              />
              {globalFilter && (
                <button onClick={() => setGlobalFilter('')} className="absolute right-2 text-[var(--placeholder)] hover:text-[var(--font)] focus:outline-none">
                  <FaTimes />
                </button>
              )}
            </div>
          )}

          {onNewAction && (
            <button onClick={onNewAction} className="p-3 bg-[var(--info)] text-white rounded hover:bg-blue-400">
              <FaPlus />
            </button>
          )}
        </div>
      </div>

      {/* Tabla con scroll horizontal */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border)] shadow-md">
        <table className="min-w-full bg-[var(--bg)] text-[var(--font)] text-left">
          <thead className="border-b bg-[var(--secondary)] text-[var(--font)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-sm font-semibold border-[var(--border)] whitespace-nowrap">
                    {header.isPlaceholder ? null : header.id !== 'selection' && header.id !== 'actions' ? (
                      <div className="cursor-pointer group hover:text-[var(--highlight)] transition duration-200" onClick={() => handleSort(header.id)}>
                        <span className="flex items-center justify-center space-x-2 group-hover:text-[var(--highlight)]">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <FaChevronDown className="text-xs ml-2" />
                        </span>
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
                <td colSpan={tableColumns.length} className="text-center py-4 text-[var(--error)] font-medium">
                  Ocurrió un error al obtener la data.
                </td>
              </tr>
            ) : loading ? (
              <tr className="border-b border-[var(--border)]">
                <td colSpan={tableColumns.length} className="text-center py-4">
                  <Loader className="text-[var(--secondary)]" />
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr className="border-b border-[var(--border)]">
                <td colSpan={tableColumns.length} className="text-center py-4 text-[var(--font)] font-medium">
                  No se encontraron resultados.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-[var(--border)] text-center hover:bg-[var(--hover2)] transition duration-200">
                  {row.getVisibleCells().map((cell) => {
                    if (statusAccessor && cell.column.id === statusAccessor) {
                      const status = cell.getValue() as 'A' | 'I';
                      return (
                        <td key={cell.id} className="whitespace-nowrap px-6 py-4 text-sm font-light border-[var(--border)]">
                          <div className="flex items-center justify-center">
                            <Toggle isActive={status === 'A'} onToggle={() => handleStatusToggle(row.original)} />
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td key={cell.id} className="whitespace-nowrap px-6 py-4 text-sm font-light border-[var(--border)]">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {showOptions && totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2 flex-wrap">
          <button
            onClick={() => setPagination({ ...pagination, pageIndex: 0 })}
            disabled={pagination.pageIndex === 0}
            className="px-3 py-1 bg-[var(--bg)] rounded-md hover:bg-[var(--hover)] disabled:opacity-50"
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            onClick={() => setPagination({ ...pagination, pageIndex: Math.max(0, pagination.pageIndex - 1) })}
            disabled={pagination.pageIndex === 0}
            className="px-3 py-1 bg-[var(--bg)] rounded-md hover:bg-[var(--hover)] disabled:opacity-50"
          >
            <FaAngleLeft />
          </button>
          {renderPaginationButtons()}
          <button
            onClick={() => setPagination({ ...pagination, pageIndex: Math.min(totalPages - 1, pagination.pageIndex + 1) })}
            disabled={pagination.pageIndex === totalPages - 1}
            className="px-3 py-1 bg-[var(--bg)] rounded-md hover:bg-[var(--hover)] disabled:opacity-50"
          >
            <FaAngleRight />
          </button>
          <button
            onClick={() => setPagination({ ...pagination, pageIndex: totalPages - 1 })}
            disabled={pagination.pageIndex === totalPages - 1}
            className="px-3 py-1 bg-[var(--bg)] rounded-md hover:bg-[var(--hover)] disabled:opacity-50"
          >
            <FaAngleDoubleRight />
          </button>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="ml-2 p-2 bg-[var(--hover)] text-[var(--font)] rounded md:mt-0 mt-3"
          >
            {[5, 10, 20].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Mostrar {pageSize}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Overlay eliminacion individual */}
      {overlayData && (
        <motion.div
          className="absolute z-50 bg-[var(--bg)] border border-[var(--border)] rounded shadow-lg p-4"
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
            <button onClick={confirmDelete} className="w-[25%] px-3 py-1 bg-[var(--error)] text-[var(--font)] rounded hover:bg-red-400">
              Sí
            </button>
            <button onClick={cancelDelete} className="w-[25%] px-3 py-1 bg-[var(--info)] text-[var(--font)] rounded hover:bg-blue-400">
              No
            </button>
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
              <button onClick={confirmMassDelete} className="px-4 py-2 bg-[var(--error)] text-white rounded hover:bg-red-400">
                Sí
              </button>
              <button onClick={() => setShowMassDeleteConfirmation(false)} className="px-4 py-2 bg-[var(--info)] text-white rounded hover:bg-blue-400">
                No
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default QueryTable;
