import { analyticsApi } from '../_api';

export const analyticsService = {
    taskSummary: (teamId: number, dateFrom?: string, dateTo?: string) =>
        analyticsApi.taskSummary(teamId, dateFrom, dateTo).then((res) => res.data.data),

    teamProductivity: (teamId: number, dateFrom?: string, dateTo?: string) =>
        analyticsApi.teamProductivity(teamId, dateFrom, dateTo).then((res) => res.data.data),

    upcomingDeadlines: (teamId: number) =>
        analyticsApi.upcomingDeadlines(teamId).then((res) => res.data.data),

    exportTasks: (payload: Record<string, unknown>) => analyticsApi.exportTasks(payload),
};
