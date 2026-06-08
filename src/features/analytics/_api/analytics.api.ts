import { nodeClient } from '@/features/shared/api';
import type { ApiResponse } from '@/features/shared/types';
import type { AnalyticsSummary, TeamProductivity, UpcomingDeadlines } from '../_types';

export const analyticsApi = {
    taskSummary: (teamId: number, dateFrom?: string, dateTo?: string) =>
        nodeClient.get<ApiResponse<AnalyticsSummary>>('/analytics/task-summary', {
            params: { team_id: teamId, date_from: dateFrom, date_to: dateTo },
        }),

    teamProductivity: (teamId: number, dateFrom?: string, dateTo?: string) =>
        nodeClient.get<ApiResponse<TeamProductivity>>('/analytics/team-productivity', {
            params: { team_id: teamId, date_from: dateFrom, date_to: dateTo },
        }),

    upcomingDeadlines: (teamId: number) =>
        nodeClient.get<ApiResponse<UpcomingDeadlines>>('/analytics/upcoming-deadlines', {
            params: { team_id: teamId },
        }),

    exportTasks: (payload: Record<string, unknown>) =>
        nodeClient.post<Blob>('/export/tasks', payload, { responseType: 'blob' }),
};
