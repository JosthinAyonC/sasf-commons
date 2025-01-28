import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import React, { useState } from 'react';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useDebounce from '~/hooks/useDebounce';
import { RootState } from '~/store';

import { Loader } from './Loader';

interface TableProps<T extends object> {
  columns: ColumnDef<T>[];
  fetchUrl: string;
  queryParams?: Record<string, string | number | boolean>;
  filterKey?: string;
  pageKey?: string;
  sizeKey?: string;
  responseDataKey?: string;
  debounceDelay?: number;
  showOptions?: boolean;
  searchable?: boolean;
  onSelectAction?: (_row: T) => void;
}

const QueryTable = <T extends object>({
  columns,
  fetchUrl,
  queryParams = {},
  filterKey = 'filter',
  pageKey = 'page',
  sizeKey = 'size',
  debounceDelay = 300,
  responseDataKey = 'content',
  showOptions = true,
  searchable = true,
  onSelectAction,
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

  const table = useReactTable({
    data: Array.isArray(fetchedData?.[responseDataKey]) ? fetchedData?.[responseDataKey] : [],
    columns,
    pageCount: fetchedData ? Math.ceil(fetchedData.totalElements / pagination.pageSize) : 0,
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
    <div className="flex flex-col ">
      {/* Campo de búsqueda */}
      {searchable && (
        <input
          type="text"
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar..."
          className="mb-4 p-2 border-[var(--border)] rounded w-full bg-[var(--bg)] text-[var(--font)] placeholder-[var(--placeholder)]
                    focus:outline-none focus:ring focus:border-[var(--highlight)]"
        />
      )}

      <div className="overflow-x-auto rounded-xl">
        <div className="inline-block min-w-full py-2">
          <div className="overflow-hidden">
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
                    <td colSpan={columns.length} className="text-center py-4">
                      <Loader className="text-[var(--secondary)]" />
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr className="border-b border-[var(--border)]">
                    <td colSpan={columns.length} className="text-center py-4">
                      No se encontraron resultados
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={`border-b border-[var(--border)] ${onSelectAction ? 'cursor-pointer hover:bg-[var(--hover2)]' : ''}`}
                      onClick={() => {
                        if (onSelectAction) {
                          onSelectAction(row.original);
                        }
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="whitespace-nowrap px-6 py-4 text-sm font-light border-[var(--border)]">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryTable;
