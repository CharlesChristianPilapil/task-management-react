import { Link } from 'react-router-dom';

import type { DataTableColumn } from '@/components/ui/data-table';
import { ROUTES } from '@/config/routes';

import type { Task } from '../_types';
import { formatDateTime, formatDueDate, priorityStyles, statusStyles } from './task-display';

export const taskTableColumns: DataTableColumn<Task>[] = [
    {
        key: 'title',
        header: 'Title',
        className: 'min-w-[12rem]',
        render: (task) => (
            <Link
                to={ROUTES.TASK_DETAIL.replace(':id', String(task.id))}
                className="font-medium hover:underline"
            >
                {task.title}
            </Link>
        ),
    },
    {
        key: 'status',
        header: 'Status',
        render: (task) => (
            <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[task.status]}`}
            >
                {task.status_label ?? task.status.replace('_', ' ')}
            </span>
        ),
    },
    {
        key: 'priority',
        header: 'Priority',
        render: (task) => (
            <span className={`capitalize ${priorityStyles[task.priority]}`}>
                {task.priority_label ?? task.priority}
            </span>
        ),
    },
    {
        key: 'due_date',
        header: 'Due date',
        render: (task) => formatDueDate(task.due_date),
    },
    {
        key: 'assignee.name',
        header: 'Assignee',
    },
    {
        key: 'created_at',
        header: 'Created',
        render: (task) => formatDateTime(task.created_at),
    },
];
