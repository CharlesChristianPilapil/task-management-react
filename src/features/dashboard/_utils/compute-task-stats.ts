import type { Task } from '@/features/task-management';

export type TaskStats = {
    total: number;
    completed: number;
    in_progress: number;
    pending: number;
    cancelled: number;
};

export function computeTaskStats(tasks: Task[]): TaskStats {
    return {
        total: tasks.length,
        completed: tasks.filter((task) => task.status === 'completed').length,
        in_progress: tasks.filter((task) => task.status === 'in_progress').length,
        pending: tasks.filter((task) => task.status === 'pending').length,
        cancelled: tasks.filter((task) => task.status === 'cancelled').length,
    };
}
