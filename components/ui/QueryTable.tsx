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
  FaTimes,
  FaTrashAlt,
} from 'react-icons/fa';
import { tableEventEmitter } from '~/config/eventEmitter';
import { CheckBoxUi } from '~/form/ui';
import { useDebounce, useMediaQuery, useQuery, useToast } from '~/hooks';

import { Loader } from './Loader';
import { Toggle } from './Toggle';

interface TableProps<T extends object> {
  columns: ColumnDef<T>[];
  fetchUrl: string;
  searchUrl?: string;
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
  defaultSortQuery?: string;
  sorteable?: boolean;
  pagesToShow?: number;
  tableClassName?: string;
  rowExpand?: (_row: T) => JSX.Element;
  disableRowExpand?: (_row: T) => boolean;
}

/**
 * Este componente es una tabla que se conecta a un endpoint para obtener los datos a mostrar.
 * funciona para cruds sencillos, para tablas más complejas que mapeen relaciones
 * Lo recomendado es instalar prime react y usar sus componentes
 * Mapeando su lógica dentro del mismo componente.
 *
 * El componente esta demasiado adaptado a la esctrutura de Pageable de Spring Boot,
 * TODO: Hacerlo más genérico para que pueda ser usado con cualquier API
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
}: TableProps<T>) => {
  const [pagination, setPagination] = useState({
    pageIndex: defaultPage,
    pageSize: defaultSize,
  });

  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const debouncedFilter = useDebounce(globalFilter, debounceDelay);
  const [overlayData, setOverlayData] = useState<{ row: T; buttonRect: DOMRect } | null>(null);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [showMassDeleteConfirmation, setShowMassDeleteConfirmation] = useState(false);
  const [sortQuery, setSortQuery] = useState(defaultSortQuery);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { addToast } = useToast();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (isMobile && !hasShownToast.current) {
      addToast('Por favor rota tu pantalla para mejor experiencia', 'info');
      hasShownToast.current = true;
    }
  }, [isMobile]);

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
  const { data, loading, error, refetch } = useQuery<(Record<string, unknown> & { content: T[]; totalElements: number }) | null>(
    fetchUrl,
    undefined,
    queryParamsWithPagination
  );
  const totalPages = data ? Math.ceil((data[responseTotalCount] as number) / pagination.pageSize) : 0;

  useEffect(() => {
    const listener = () => refetch('', true);
    tableEventEmitter.on('refreshTable', listener);

    return () => {
      tableEventEmitter.off('refreshTable', listener);
    };
  }, [refetch]);

  useEffect(() => {
    setExpandedRows({});
    if (searchUrl) {
      refetch(searchUrl);
    }
  }, [globalFilter]);

  const handleDeleteClick = (row: T, buttonRect: DOMRect) => {
    setOverlayData({ row, buttonRect });
  };

  const handleSort = (columnId: string, sorter: string) => {
    setPagination({ ...pagination, pageIndex: 0 });
    setSortQuery(`${columnId.replaceAll('_', '.')},${sorter}`);
  };

  const confirmDelete = async () => {
    if (overlayData && onDeleteAction) {
      await onDeleteAction(overlayData.row);
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
      refetch('', true); // Ahora se ejecuta solo cuando la mutación se completa
    }
    setSelectedRows([]);
    setShowMassDeleteConfirmation(false);
  };

  const selectionColumn: ColumnDef<T> = {
    id: 'selection',
    header: () => (
      <div className="flex">
        <button
          type="button"
          onClick={() => setShowMassDeleteConfirmation(true)}
          className={`p-2 rounded-md bg-[var(--hover2)] text-[var(font)] hover:text-[var(--error)] ${selectedRows.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Eliminar seleccionados"
          disabled={selectedRows.length === 0}
        >
          <FaTrashAlt className="lg" />
        </button>
      </div>
    ),
    cell: ({ row }) => <CheckBoxUi checked={selectedRows.includes(row.original)} onChange={() => handleRowSelection(row.original)} />,
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

  const tableColumns = [...(onDeleteMassiveAction ? [selectionColumn] : []), ...(onSelectAction || onDeleteAction ? [actionColumn] : []), ...columns].filter(
    (column) => column.id !== 'selection' || onDeleteMassiveAction
  );

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
                placeholder="Buscar..."
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
          <thead className="border-b bg-[var(--secondary)] text-[var(--font)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {rowExpand && <th className="px-4 py-4 text-sm font-medium border-[var(--border)]"></th>}
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-sm font-semibold border-[var(--border)] whitespace-nowrap">
                    {header.isPlaceholder ? null : header.id !== 'selection' && header.id !== 'actions' ? (
                      <div className="group flex justify-center items-center space-x-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sorteable && (
                          <div className="flex flex-col">
                            <FaChevronUp
                              className={`cursor-pointer text-xs ml-2 text-[var(--font)] hover:text-[var(--hover2)]`}
                              onClick={() => handleSort(header.id, 'asc')}
                            />
                            <FaChevronDown
                              className={`-mt-[3px] cursor-pointer text-xs ml-2 text-[var(--font)] hover:text-[var(--hover2)]`}
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
                <td colSpan={tableColumns.length + (rowExpand ? 1 : 0)} className="text-center py-4 text-[var(--error)] font-medium">
                  Ocurrió un error al obtener la data.
                </td>
              </tr>
            ) : loading ? (
              <tr className="border-b border-[var(--border)]">
                <td colSpan={tableColumns.length + (rowExpand ? 1 : 0)} className="text-center py-4">
                  <Loader className="text-[var(--secondary)]" />
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr className="border-b border-[var(--border)]">
                <td colSpan={tableColumns.length + (rowExpand ? 1 : 0)} className="text-center py-4 text-[var(--font)] font-medium">
                  No se encontraron resultados.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr key={row.id} className="border-b border-[var(--border)] text-center hover:bg-[var(--hover2)] transition duration-200">
                    {rowExpand && (
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-light border-[var(--border)]">
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
                  {expandedRows[row.id] && rowExpand && (
                    <tr className="border-b">
                      <td colSpan={columns.length + 1} className="p-4 text-left bg-[var(--bg)] relative">
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
              Mostrando del registro {pagination.pageIndex * pagination.pageSize + 1} al{' '}
              {Math.min((pagination.pageIndex + 1) * pagination.pageSize, typeof data?.[responseTotalCount] === 'number' ? data[responseTotalCount] : 0)} de{' '}
              {String(data?.[responseTotalCount] ?? 0)}
            </span>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setPagination({ ...pagination, pageIndex: 0 })}
              disabled={pagination.pageIndex === 0}
              className="px-3 py-1 bg-[var(--bg)] rounded-md hover:bg-[var(--hover)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaAngleDoubleLeft className="text-[var(--font)]" />
            </button>
            <button
              type="button"
              onClick={() => setPagination({ ...pagination, pageIndex: Math.max(0, pagination.pageIndex - 1) })}
              disabled={pagination.pageIndex === 0}
              className="px-3 py-1 bg-[var(--bg)] rounded-md hover:bg-[var(--hover)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaAngleLeft className="text-[var(--font)]" />
            </button>
            {renderPaginationButtons()}
            <button
              type="button"
              onClick={() => setPagination({ ...pagination, pageIndex: Math.min(totalPages - 1, pagination.pageIndex + 1) })}
              disabled={pagination.pageIndex === totalPages - 1}
              className="px-3 py-1 bg-[var(--bg)] rounded-md hover:bg-[var(--hover)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaAngleRight className="text-[var(--font)]" />
            </button>
            <button
              type="button"
              onClick={() => setPagination({ ...pagination, pageIndex: totalPages - 1 })}
              disabled={pagination.pageIndex === totalPages - 1}
              className="px-3 py-1 bg-[var(--bg)] rounded-md hover:bg-[var(--hover)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaAngleDoubleRight className="text-[var(--font)]" />
            </button>
          </div>
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
            <button type="button" onClick={confirmDelete} className="w-[25%] px-3 py-1 bg-[var(--error)] text-[var(--font)] rounded hover:bg-red-400">
              Sí
            </button>
            <button type="button" onClick={cancelDelete} className="w-[25%] px-3 py-1 bg-[var(--info)] text-[var(--font)] rounded hover:bg-blue-400">
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
              <button type="button" onClick={confirmMassDelete} className="px-4 py-2 bg-[var(--error)] text-white rounded hover:bg-red-400">
                Sí
              </button>
              <button
                type="button"
                onClick={() => setShowMassDeleteConfirmation(false)}
                className="px-4 py-2 bg-[var(--info)] text-white rounded hover:bg-blue-400"
              >
                No
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
