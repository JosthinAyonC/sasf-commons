import { ColumnDef, filterFns, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import React from 'react';

interface TableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
}

const Table = <T extends object>({ data, columns }: TableProps<T>) => {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const [globalFilter, setGlobalFilter] = React.useState('');

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
    <div className="flex flex-col ">
      {/* Campo de búsqueda */}
      <input
        type="text"
        value={globalFilter ?? ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Buscar..."
        className="mb-4 p-2 border-[var(--border)] rounded w-full bg-[var(--bg)] text-[var(--font)] placeholder-[var(--placeholder)]
                  focus:outline-none focus:ring focus:border-[var(--highlight)]"
      />

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
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="whitespace-nowrap px-6 py-4 text-sm font-light border-[var(--border)]">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Controles de paginación */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
