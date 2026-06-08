import type { Task } from '../_types';

export const statusStyles: Record<Task['status'], string> = {
    pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    in_progress: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    completed: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    cancelled: 'bg-muted text-muted-foreground',
};

export const priorityStyles: Record<Task['priority'], string> = {
    low: 'text-muted-foreground',
    medium: 'text-amber-600 dark:text-amber-400',
    high: 'text-red-600 dark:text-red-400',
};

export function formatDueDate(dueDate: string | null) {
    if (!dueDate) {
        return 'No due date';
    }

    return new Date(dueDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export function formatDateTime(value: string | null) {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
