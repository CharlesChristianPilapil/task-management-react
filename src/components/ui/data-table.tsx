import type { ReactNode } from 'react';

import { getNestedValue } from '@/features/shared/utils/get-nested-value';
import { cn } from '@/lib/utils';

export type DataTableColumn<T> = {
    key: string;
    header: string;
    className?: string;
    headerClassName?: string;
    render?: (row: T, value: unknown) => ReactNode;
};

export type DataTableProps<T extends object> = {
    columns: DataTableColumn<T>[];
    data: T[];
    rowKey: keyof T | ((row: T) => string | number);
    emptyMessage?: string;
    className?: string;
};

function resolveRowKey<T extends object>(
    row: T,
    rowKey: DataTableProps<T>['rowKey'],
): string | number {
    if (typeof rowKey === 'function') {
        return rowKey(row);
    }

    return row[rowKey] as string | number;
}

function formatCellValue(value: unknown): ReactNode {
    if (value === null || value === undefined || value === '') {
        return <span className="text-muted-foreground">—</span>;
    }

    return String(value);
}

export function DataTable<T extends object>({
    columns,
    data,
    rowKey,
    emptyMessage = 'No data available.',
    className,
}: DataTableProps<T>) {
    if (data.length === 0) {
        return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
    }

    return (
        <div className={cn('overflow-x-auto', className)}>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b text-left text-muted-foreground">
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={cn('pb-2 pr-4 font-medium', column.headerClassName)}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr
                            key={resolveRowKey(row, rowKey)}
                            className="border-b last:border-0"
                        >
                            {columns.map((column) => {
                                const value = getNestedValue(row, column.key);

                                return (
                                    <td
                                        key={column.key}
                                        className={cn('py-2 pr-4', column.className)}
                                    >
                                        {column.render ? column.render(row, value) : formatCellValue(value)}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
