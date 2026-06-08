export type AnalyticsSummary = {
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    in_progress_tasks: number;
};

export type TeamProductivity = {
    team_id: number;
    completion_rate: number;
    tasks_completed: number;
    tasks_total: number;
};

export type UpcomingDeadline = {
    task_id: number;
    title: string;
    due_date: string;
    assigned_to: number | null;
};
