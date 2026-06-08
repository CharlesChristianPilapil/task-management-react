import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/ui/pagination';
import type { PaginationMeta } from '@/features/shared/types';

import type { Task } from '../_types';
import { taskTableColumns } from '../_utils/task-table-columns';

type TasksTableProps = {
    tasks: Task[];
    pagination: PaginationMeta;
    isLoading?: boolean;
    onPageChange: (page: number) => void;
};

export function TasksTable({ tasks, pagination, isLoading, onPageChange }: TasksTableProps) {
    return (
        <div className="flex flex-col gap-4">
            <DataTable
                columns={taskTableColumns}
                data={tasks}
                rowKey="id"
                emptyMessage="No tasks found."
            />
            <Pagination
                pagination={pagination}
                onPageChange={onPageChange}
                isLoading={isLoading}
            />
        </div>
    );
}
