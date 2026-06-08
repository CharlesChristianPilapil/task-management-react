import type { TaskStatus } from '../_types';

const STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
    pending: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'pending'],
    completed: [],
    cancelled: [],
};

export function getAllowedStatusOptions(currentStatus: TaskStatus): TaskStatus[] {
    return [currentStatus, ...STATUS_TRANSITIONS[currentStatus]];
}