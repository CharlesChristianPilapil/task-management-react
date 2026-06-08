import { laravelClient } from '@/features/shared/api';
import type { ApiResponse } from '@/features/shared/types';
import type { Team, TeamMember } from '../_types';

export const teamApi = {
    list: () => laravelClient.get<ApiResponse<Team[]>>('/teams'),

    get: (teamId: number) => laravelClient.get<ApiResponse<Team>>(`/teams/${teamId}`),

    create: (payload: Pick<Team, 'name' | 'description'>) =>
        laravelClient.post<ApiResponse<Team>>('/teams', payload),

    addMember: (teamId: number, userId: number) =>
        laravelClient.post<ApiResponse<TeamMember>>(`/teams/${teamId}/members`, {
            user_id: userId,
        }),

    removeMember: (teamId: number, userId: number) =>
        laravelClient.delete<ApiResponse<null>>(`/teams/${teamId}/members/${userId}`),
};
