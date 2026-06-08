import type { ApiResponse, PaginatedData } from '@/features/shared/types';
import { invalidateOnMutationSuccess } from '@/features/shared/utils/invalidate-on-mutation-success';
import { api } from '@/services/BaseApiService';

import { teamApi } from '../_api';
import type { Team, TeamListParams, TeamListResult } from '../_types';

type TeamWithMembers = Team & { members?: import('../_types').TeamMember[] };

function transformTeamListResponse(
    response: ApiResponse<PaginatedData<Team, 'teams'>>,
): TeamListResult {
    return {
        teams: response.data.teams,
        pagination: response.data.pagination,
    };
}

export const teamService = {
    list: (params?: TeamListParams): Promise<TeamListResult> =>
        teamApi.list(params).then((res) => ({
            teams: res.data.data.teams,
            pagination: res.data.data.pagination,
        })),

    get: (teamId: number) => teamApi.get(teamId).then((res) => res.data.data),

    create: (payload: Pick<Team, 'name'>) => teamApi.create(payload).then((res) => res.data.data),

    addMember: (
        teamId: number,
        payload: { user_id: number; role?: 'member' | 'lead' },
    ) => teamApi.addMember(teamId, payload).then((res) => res.data.data),

    removeMember: (teamId: number, userId: number) =>
        teamApi.removeMember(teamId, userId).then((res) => res.data.data),
};

type AddMemberPayload = {
    user_id: number;
    role?: 'member' | 'lead';
};

export const teamRtkService = api.injectEndpoints({
    endpoints: (builder) => ({
        listTeams: builder.query<TeamListResult, TeamListParams | void>({
            query: (params) => ({
                url: '/teams',
                params: params ?? {},
            }),
            transformResponse: transformTeamListResponse,
            providesTags: (result) =>
                result
                    ? [
                          { type: 'Teams' as const, id: 'LIST' },
                          ...result.teams.map(({ id }) => ({ type: 'Teams' as const, id })),
                      ]
                    : [{ type: 'Teams' as const, id: 'LIST' }],
        }),

        getTeam: builder.query<TeamWithMembers, number>({
            query: (teamId) => `/teams/${teamId}`,
            transformResponse: (response: ApiResponse<TeamWithMembers>) => response.data,
            providesTags: (_result, _error, teamId) => [{ type: 'Teams', id: teamId }],
        }),

        addTeamMember: builder.mutation<TeamWithMembers, { teamId: number; payload: AddMemberPayload }>({
            query: ({ teamId, payload }) => ({
                url: `/teams/${teamId}/members`,
                method: 'POST',
                body: payload,
            }),
            transformResponse: (response: ApiResponse<TeamWithMembers>) => response.data,
            onQueryStarted: invalidateOnMutationSuccess((_result, { teamId }) => [
                { type: 'Teams', id: teamId },
                { type: 'Teams', id: 'LIST' },
            ]),
        }),

        removeTeamMember: builder.mutation<null, { teamId: number; userId: number }>({
            query: ({ teamId, userId }) => ({
                url: `/teams/${teamId}/members/${userId}`,
                method: 'DELETE',
            }),
            transformResponse: (response: ApiResponse<null>) => response.data,
            onQueryStarted: invalidateOnMutationSuccess((_result, { teamId }) => [
                { type: 'Teams', id: teamId },
                { type: 'Teams', id: 'LIST' },
            ]),
        }),

        createTeam: builder.mutation<Team, Pick<Team, 'name'>>({
            query: (payload) => ({
                url: '/teams',
                method: 'POST',
                body: payload,
            }),
            transformResponse: (response: ApiResponse<Team>) => response.data,
            onQueryStarted: invalidateOnMutationSuccess([{ type: 'Teams', id: 'LIST' }]),
        }),
    }),
});

export const {
    useListTeamsQuery,
    useGetTeamQuery,
    useAddTeamMemberMutation,
    useRemoveTeamMemberMutation,
    useCreateTeamMutation,
} = teamRtkService;
