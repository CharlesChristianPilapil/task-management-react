import { laravelClient } from '@/features/shared/api';
import type { ApiResponse, PaginatedData } from '@/features/shared/types';
import type { Team, TeamListParams, TeamMember } from '../_types';

export const teamApi = {
    list: (params?: TeamListParams) =>
        laravelClient.get<ApiResponse<PaginatedData<Team, 'teams'>>>('/teams', { params }),

    get: (teamId: number) => laravelClient.get<ApiResponse<Team & { members?: TeamMember[] }>>(`/teams/${teamId}`),

    create: (payload: Pick<Team, 'name'>) => laravelClient.post<ApiResponse<Team>>('/teams', payload),

    addMember: (
        teamId: number,
        payload: { user_id: number; role?: 'member' | 'lead' },
    ) => laravelClient.post<ApiResponse<Team>>(`/teams/${teamId}/members`, payload),

    removeMember: (teamId: number, userId: number) =>
        laravelClient.delete<ApiResponse<null>>(`/teams/${teamId}/members/${userId}`),
};
