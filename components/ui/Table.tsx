import { ColumnDef, filterFns, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaChevronRight, FaEdit, FaExclamationTriangle, FaTrashAlt } from 'react-icons/fa';

import { Loader } from './Loader';

interface TableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  searchable?: boolean;
  loading?: boolean;
  showOptions?: boolean;
  defaultPage?: number;
  defaultSize?: number;
  tableClassName?: string;
  onSelectAction?: (_row: T) => void;
  onDeleteAction?: (_row: T) => void;
  rowExpand?: (_row: T) => JSX.Element;
  disableRowExpand?: (_row: T) => boolean;
}

export const Table = <T extends object>({
  data,
  columns,
  loading = false,
  defaultPage = 0,
  defaultSize = 5,
  showOptions = true,
  searchable = true,
  tableClassName,
  onSelectAction,
  onDeleteAction,
  rowExpand,
  disableRowExpand,
}: TableProps<T>) => {
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
  const [overlayData, setOverlayData] = useState<{ row: T; buttonRect: DOMRect } | null>(null);

  const toggleRowExpansion = (rowId: string, row: T) => {
    if (typeof disableRowExpand === 'function' && disableRowExpand(row)) return;

    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const handleDeleteClick = (row: T, buttonRect: DOMRect) => {
    setOverlayData({ row, buttonRect });
  };

  const confirmDelete = async () => {
    if (overlayData && onDeleteAction) {
      await onDeleteAction(overlayData.row);
    }
    setOverlayData(null);
  };

  const cancelDelete = () => {
    setOverlayData(null);
  };

  const actionColumn: ColumnDef<T> = {
    id: 'actions',
    header: () => 'Acciones',
    cell: ({ row }) => (
      <div className="flex items-center justify-center space-x-2 relative">
        {onSelectAction && (
          <button type="button" onClick={() => onSelectAction(row.original)} className="text-blue-500 hover:text-[var(--info)]" title="Editar">
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

  const [pagination, setPagination] = useState({
    pageIndex: defaultPage,
    pageSize: defaultSize,
  });

  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    setExpandedRows({});
  }, [globalFilter]);

  const tableColumns = [...(onSelectAction || onDeleteAction ? [actionColumn] : []), ...columns];

  const table = useReactTable({
    data,
    columns: tableColumns,
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
    <div className={`flex flex-col rounded-lg shadow-md border border-[var(--border)] ${tableClassName ?? ''}`}>
      {/* Campo de búsqueda */}
      {searchable && (
        <input
          type="text"
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar..."
          className="mb-4 p-2 border-[var(--border)] rounded-md w-full bg-[var(--bg)] text-[var(--font)] placeholder-[var(--placeholder)]
              focus:outline-none focus:ring focus:border-[var(--highlight)]"
        />
      )}

      <div className="overflow-x-auto rounded-lg">
        <div className="inline-block min-w-full">
          <div className="overflow-hidden rounded-lg">
            <table className="min-w-full text-center bg-[var(--bg)] text-[var(--font)] border border-[var(--border)] rounded-lg">
              <thead className="border-b bg-[var(--secondary)] text-[var(--font)] rounded-t-lg">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {rowExpand && <th className="px-4 py-4 text-sm font-medium border-[var(--border)] rounded-tl-lg">Expandir</th>}
                    {headerGroup.headers.map((header, index) => (
                      <th
                        key={header.id}
                        className={`px-6 py-4 text-sm font-medium border-[var(--border)] ${index === tableColumns.length - 1 ? 'rounded-tr-lg' : ''}`}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {loading ? (
                  <tr className="border-b border-[var(--border)]">
                    <td colSpan={columns.length + (rowExpand ? 1 : 0)} className="text-center py-4">
                      <Loader className="text-[var(--secondary)]" />
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr className="border-b border-[var(--border)]">
                    <td colSpan={columns.length + (rowExpand ? 1 : 0)} className="text-center py-4 text-[var(--font)] font-medium">
                      No se encontraron registros disponibles.
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <tr className="border-b border-[var(--border)] hover:bg-[var(--hover2)] transition duration-200">
                        {rowExpand && (
                          <td className="whitespace-nowrap px-4 py-4 text-sm font-light border-[var(--border)] rounded-bl-lg">
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
                        {row.getVisibleCells().map((cell, index) => (
                          <td
                            key={cell.id}
                            className={`whitespace-nowrap px-6 py-4 text-sm font-light border-[var(--border)] ${index === tableColumns.length - 1 ? 'rounded-br-lg' : ''}`}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                      {expandedRows[row.id] && rowExpand && (
                        <tr className="border-b">
                          <td colSpan={columns.length + 1} className="p-4 text-left bg-[var(--bg)] relative rounded-b-lg">
                            {/* Línea de conexión para la jerarquía */}
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

            {/* Controles de paginación mejorados */}
            {showOptions && (
              <div className="mt-4 px-4 py-2 border-t border-[var(--border)] rounded-b-lg flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                {/* Información de registros */}
                <span className="text-[var(--font)] text-sm text-center md:text-left">
                  Mostrando del registro {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} al{' '}
                  {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)} de {data.length} registros
                </span>

                {/* Controles de paginación */}
                <div className="flex items-center justify-center space-x-2">
                  <button
                    type="button"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="px-3 py-1 bg-[var(--hover)] text-[var(--font)] rounded-md disabled:opacity-50"
                  >
                    <FaAngleDoubleLeft />
                  </button>
                  <button
                    type="button"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-3 py-1 bg-[var(--hover)] text-[var(--font)] rounded-md disabled:opacity-50"
                  >
                    <FaAngleLeft />
                  </button>

                  <span className="text-[var(--font)] text-sm">
                    Página{' '}
                    <strong>
                      {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                    </strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-3 py-1 bg-[var(--hover)] text-[var(--font)] rounded-md disabled:opacity-50"
                  >
                    <FaAngleRight />
                  </button>
                  <button
                    type="button"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    className="px-3 py-1 bg-[var(--hover)] text-[var(--font)] rounded-md disabled:opacity-50"
                  >
                    <FaAngleDoubleRight />
                  </button>

                  {/* Select para cantidad de registros */}
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                      table.setPageSize(Number(e.target.value));
                    }}
                    className="ml-2 p-2 bg-[var(--hover)] text-[var(--font)] rounded-md transition focus:outline-none focus:ring focus:ring-[var(--highlight)]"
                  >
                    {[5, 10, 20].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        Mostrar {pageSize}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
            <button type="button" onClick={confirmDelete} className="w-[25%] px-3 py-1 bg-[var(--error)] text-[var(--font)] rounded hover:bg-red-400">
              Sí
            </button>
            <button type="button" onClick={cancelDelete} className="w-[25%] px-3 py-1 bg-[var(--info)] text-[var(--font)] rounded hover:bg-blue-400">
              No
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
