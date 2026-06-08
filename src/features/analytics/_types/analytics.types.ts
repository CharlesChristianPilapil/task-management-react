export type AnalyticsSummary = {
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    avg_completion_time: number | null;
};

export type MemberProductivity = {
    user_id: number | null;
    name: string;
    task_count: number;
    completed_count: number;
    completion_rate: number;
    avg_completion_time: number | null;
};

export type TeamProductivity = {
    team_id: number;
    members: MemberProductivity[];
};

export type UpcomingDeadlineTask = {
    id: number;
    title: string;
    status: string;
    priority: string;
    due_date: string;
};

export type UpcomingDeadlines = {
    team_id: number;
    window_days: number;
    members: {
        user_id: number | null;
        name: string;
        tasks: UpcomingDeadlineTask[];
    }[];
};
