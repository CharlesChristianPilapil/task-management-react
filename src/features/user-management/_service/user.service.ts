import type { ApiResponse, PaginatedData } from '@/features/shared/types';
import { invalidateOnMutationSuccess } from '@/features/shared/utils/invalidate-on-mutation-success';
import { api } from '@/services/BaseApiService';

import { userApi } from '../_api';
import type {
    CreateUserPayload,
    UpdateUserPayload,
    User,
    UserListParams,
    UserListResult,
} from '../_types';

function transformUserListResponse(
    response: ApiResponse<PaginatedData<User, 'users'>>,
): UserListResult {
    return {
        users: response.data.users,
        pagination: response.data.pagination,
    };
}

export const userService = {
    list: (params?: UserListParams): Promise<UserListResult> =>
        userApi.list(params).then((res) => ({
            users: res.data.data.users,
            pagination: res.data.data.pagination,
        })),

    get: (userId: number) => userApi.get(userId).then((res) => res.data.data),

    create: (payload: CreateUserPayload) => userApi.create(payload).then((res) => res.data.data),

    update: (userId: number, payload: UpdateUserPayload) =>
        userApi.update(userId, payload).then((res) => res.data.data),

    toggleStatus: (userId: number) => userApi.toggleStatus(userId).then((res) => res.data.data),
};

export const userRtkService = api.injectEndpoints({
    endpoints: (builder) => ({
        listUsers: builder.query<UserListResult, UserListParams | void>({
            query: (params) => ({
                url: '/users',
                params: params ?? {},
            }),
            transformResponse: transformUserListResponse,
            providesTags: (result) =>
                result
                    ? [
                          { type: 'Users' as const, id: 'LIST' },
                          ...result.users.map(({ id }) => ({ type: 'Users' as const, id })),
                      ]
                    : [{ type: 'Users' as const, id: 'LIST' }],
        }),

        getUser: builder.query<User, number>({
            query: (userId) => `/users/${userId}`,
            transformResponse: (response: ApiResponse<User>) => response.data,
            providesTags: (_result, _error, userId) => [{ type: 'Users', id: userId }],
        }),

        createUser: builder.mutation<User, CreateUserPayload>({
            query: (payload) => ({
                url: '/users',
                method: 'POST',
                body: payload,
            }),
            transformResponse: (response: ApiResponse<User>) => response.data,
            onQueryStarted: invalidateOnMutationSuccess([{ type: 'Users', id: 'LIST' }]),
        }),

        updateUser: builder.mutation<User, { userId: number; payload: UpdateUserPayload }>({
            query: ({ userId, payload }) => ({
                url: `/users/${userId}`,
                method: 'PATCH',
                body: payload,
            }),
            transformResponse: (response: ApiResponse<User>) => response.data,
            onQueryStarted: invalidateOnMutationSuccess((_result, { userId }) => [
                { type: 'Users', id: userId },
                { type: 'Users', id: 'LIST' },
            ]),
        }),

        toggleUserStatus: builder.mutation<User, number>({
            query: (userId) => ({
                url: `/users/${userId}/status`,
                method: 'PATCH',
            }),
            transformResponse: (response: ApiResponse<User>) => response.data,
            onQueryStarted: invalidateOnMutationSuccess((_result, userId) => [
                { type: 'Users', id: userId },
                { type: 'Users', id: 'LIST' },
            ]),
        }),
    }),
});

export const {
    useListUsersQuery,
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useToggleUserStatusMutation,
} = userRtkService;
