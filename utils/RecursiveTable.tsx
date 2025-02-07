import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { Table } from '~/components/ui';

interface RecursiveTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  childKey: keyof T;
  disableRowExpand?: (_row: T) => boolean;
}
export const RecursiveTable = <T extends object>({ data, columns, childKey, disableRowExpand }: RecursiveTableProps<T>) => {
  return (
    <Table<T>
      data={data}
      columns={columns}
      showOptions={false}
      searchable={false}
      defaultSize={25}
      disableRowExpand={(row) => (disableRowExpand ? disableRowExpand(row) : !(row[childKey] as T[]).length)}
      rowExpand={(row) => {
        const children = row[childKey] as T[];
        return <>{children.length ? <RecursiveTable<T> data={children} columns={columns} childKey={childKey} disableRowExpand={disableRowExpand} /> : null}</>;
      }}
    />
  );
};
