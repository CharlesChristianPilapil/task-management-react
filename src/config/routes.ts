export const ROUTES = {
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    TASK_DETAIL: '/tasks/:id',
    TEAMS: '/teams',
    TEAM_DETAIL: '/teams/:id',
    TEAM_TASKS: '/teams/:teamId/tasks',
    USERS: '/users',
    ANALYTICS: '/analytics',
    SETTINGS: '/settings',
} as const;

export function teamTasksPath(teamId: number) {
    return `/teams/${teamId}/tasks`;
}
