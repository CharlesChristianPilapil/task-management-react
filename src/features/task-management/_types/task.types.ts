export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
    id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    team_id: number;
    assigned_to: number | null;
    created_by: number;
    due_date: string | null;
    created_at: string;
    updated_at: string;
};
