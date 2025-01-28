import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { FaEdit, FaExclamationTriangle, FaFilter, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
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
  responseDataKey?: string;
  responseTotalCount?: string;
  debounceDelay?: number;
  showOptions?: boolean;
  searchable?: boolean;
  onSelectAction?: (_row: T) => void;
  onDeleteAction?: (_row: T) => void;
  statusAccessor?: string;
  onStatusChange?: (_row: T, newStatus: 'A' | 'I') => void;
  onNewAction?: () => void;
}

const QueryTable = <T extends object>({
  columns,
  fetchUrl,
  queryParams = {},
  title,
  filterKey = 'filter',
  pageKey = 'page',
  sizeKey = 'size',
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
}: TableProps<T>) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const [globalFilter, setGlobalFilter] = useState('');
  const debouncedFilter = useDebounce(globalFilter, debounceDelay);
  const [fetchedData, setFetchedData] = useState<(Record<string, unknown> & { content: T[]; totalElements: number }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overlayData, setOverlayData] = useState<{ row: T; buttonRect: DOMRect } | null>(null);

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

    const url = `${fetchUrl}?${queryString}`;

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
  }, [fetchUrl, pagination, debouncedFilter, filterKey, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteClick = (row: T, buttonRect: DOMRect) => {
    setOverlayData({ row, buttonRect });
  };

  const confirmDelete = () => {
    if (overlayData && onDeleteAction) {
      onDeleteAction(overlayData.row);
    }
    setOverlayData(null);
  };

  const cancelDelete = () => {
    setOverlayData(null);
  };

  const handleStatusToggle = (row: T) => {
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
    onStatusChange(row, newStatus as 'A' | 'I');
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

  const tableColumns = [actionColumn, ...columns];

  const table = useReactTable<T>({
    data: Array.isArray(fetchedData?.[responseDataKey]) ? (fetchedData?.[responseDataKey] as T[]) : [],
    columns: tableColumns,
    pageCount: fetchedData ? Math.ceil((fetchedData[responseTotalCount] as number) / pagination.pageSize) : 0,
    state: { pagination, globalFilter },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  if (error) {
    return <p>Error al cargar los datos: {error}</p>;
  }

  return (
    <div className="flex flex-col">
      {/* Encabezado con búsqueda y botón de agregar */}
      <div className="flex justify-between items-center mb-4 px-4 py-2 bg-[var(--bg)] border-b border-[var(--border)] rounded-t-lg">
        <h1 className="text-2xl font-bold text-[var(--font)]">{title}</h1>
        {searchable && (
          <div className="flex items-center space-x-2">
            <div className="relative flex items-center border border-[var(--border)] rounded bg-[var(--bg)] focus-within:ring focus-within:border-[var(--highlight)]">
              <span className="px-3 text-[var(--placeholder)]">
                <FaFilter />
              </span>
              <input
                type="text"
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Buscar..."
                className="flex-1 p-2 bg-transparent text-[var(--font)] placeholder-[var(--placeholder)] focus:outline-none"
              />
            </div>
            {onNewAction && (
              <button onClick={onNewAction} className="p-2 bg-[var(--info)] text-white rounded hover:bg-blue-400">
                <FaPlus />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full text-center bg-[var(--bg)] text-[var(--font)]">
          <thead className="border-b bg-[var(--secondary)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-4 text-sm font-medium border-[var(--border)]">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr className="border-b border-[var(--border)]">
                <td colSpan={tableColumns.length} className="text-center py-4">
                  <Loader />
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr className="border-b border-[var(--border)]">
                <td colSpan={tableColumns.length} className="text-center py-4">
                  No se encontraron resultados
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-[var(--border)]">
                  {row.getVisibleCells().map((cell) => {
                    if (statusAccessor && cell.column.id === statusAccessor) {
                      const status = cell.getValue() as 'A' | 'I';
                      return (
                        <td key={cell.id} className="whitespace-nowrap px-6 py-4 text-sm font-light border-[var(--border)]">
                          <div className="flex items-center justify-center space-x-2">
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

      {/* Controles de paginación */}
      {showOptions && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 bg-[var(--hover)] text-[var(--font)] rounded disabled:opacity-50"
            >
              {'<<'}
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 bg-[var(--hover)] text-[var(--font)] rounded disabled:opacity-50"
            >
              {'<'}
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 bg-[var(--hover)] text-[var(--font)] rounded disabled:opacity-50"
            >
              {'>'}
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 bg-[var(--hover)] text-[var(--font)] rounded disabled:opacity-50"
            >
              {'>>'}
            </button>
          </div>
          <span className="text-[var(--font)]">
            Página{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </strong>
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="px-3 py-1 bg-[var(--hover)] text-[var(--font)] rounded"
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Mostrar {pageSize}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* Overlay contextual */}
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
          <div className="flex justify-between mt-4">
            <button onClick={confirmDelete} className="w-[40%] px-3 py-1 bg-[var(--error)] text-[var(--font)] rounded hover:bg-red-400">
              Sí
            </button>
            <button onClick={cancelDelete} className="w-[40%] px-3 py-1 bg-[var(--info)] text-[var(--font)] rounded hover:bg-blue-400">
              No
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default QueryTable;
