import {
  ColumnDef,
  filterFns,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useState } from 'react';
import { Loader } from './Loader';

interface TableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  functionalComponent?: (row: T) => JSX.Element; // Componente funcional a renderizar en la celda
  searchable?: boolean;
  loading?: boolean;
  showOptions?: boolean;
  defaultPage?: number;
  defaultSize?: number;
  tableClassName?: string;
}

export const Table = <T extends object>({
  data,
  columns,
  functionalComponent, // Recibe un componente funcional
  loading = false,
  defaultPage = 0,
  defaultSize = 5,
  showOptions = true,
  searchable = true,
  tableClassName,
}: TableProps<T>) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null); // Estado para controlar el componente activo

  const [pagination, setPagination] = useState({
    pageIndex: defaultPage,
    pageSize: defaultSize,
  });

  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(data.length / pagination.pageSize),
    state: { pagination, globalFilter },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: filterFns.includesString,
    manualPagination: false,
  });

  return (
    <div className={`flex flex-col ${tableClassName ?? ''}`}>
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
                    <td colSpan={columns.length} className="text-center py-4 text-[var(--font)] font-medium">
                      No se encontraron registros disponibles.
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <tr
                        className="border-b cursor-pointer hover:bg-[var(--hover)]"
                        onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="whitespace-nowrap px-6 py-4 text-sm font-light border-[var(--border)]">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                      {expandedRow === row.id && functionalComponent && (
                        <tr className="border-b">
                          <td colSpan={columns.length} className="p-4 text-left bg-[var(--secondary)]">
                            {functionalComponent(row.original)}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
            {/* Controles de paginación */}
            {showOptions && (
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="px-3 py-1 bg-[var(--hover)] text-[var(--font)] rounded disabled:opacity-50"
                  >
                    {'<<'}
                  </button>
                  <button
                    type="button"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-3 py-1 bg-[var(--hover)] text-[var(--font)] rounded disabled:opacity-50"
                  >
                    {'<'}
                  </button>
                  <button
                    type="button"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-3 py-1 bg-[var(--hover)] text-[var(--font)] rounded disabled:opacity-50"
                  >
                    {'>'}
                  </button>
                  <button
                    type="button"
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
