import type { User } from '@/features/auth';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
    id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    status_label?: string;
    priority: TaskPriority;
    priority_label?: string;
    team_id: number;
    assigned_to: number | null;
    created_by: number;
    due_date: string | null;
    assignee?: User | null;
    creator?: User | null;
    created_at: string;
    updated_at: string;
};

export type TaskListParams = {
    status?: TaskStatus;
    priority?: TaskPriority;
    assigned_to?: number;
    page?: number;
    per_page?: number;
};

export type TaskListResult = {
    tasks: Task[];
    pagination: import('@/features/shared/types').PaginationMeta;
};
