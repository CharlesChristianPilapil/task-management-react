export {
    formatDueDate,
    priorityStyles,
    statusStyles,
} from '@/features/task-management/_utils/task-display';

export function formatCompletionRate(rate: number) {
    return `${Math.round(rate * 100)}%`;
}
