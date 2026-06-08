import type { ApiResponse } from '@/features/shared/types';
import { invalidateOnMutationSuccess } from '@/features/shared/utils/invalidate-on-mutation-success';
import { api } from '@/services/BaseApiService';

import type { User } from '../_types';

type LoginPayload = {
    email: string;
    password: string;
};

type LoginApiData = {
    access_token: string;
    user: User;
};

type LoginData = {
    user: User;
    access_token: string;
};

type MeApiData = {
    user: User;
};

export const authService = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginData, LoginPayload>({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
            transformResponse: (response: ApiResponse<LoginApiData>) => ({
                user: response.data.user,
                access_token: response.data.access_token,
            }),
            onQueryStarted: invalidateOnMutationSuccess(['Auth']),
        }),
        me: builder.query<User, void>({
            query: () => '/auth/me',
            transformResponse: (response: ApiResponse<MeApiData>) => response.data.user,
            providesTags: ['Auth'],
        }),
        logout: builder.mutation<null, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            transformResponse: (response: ApiResponse<null>) => response.data,
            onQueryStarted: invalidateOnMutationSuccess(['Auth']),
        }),
    }),
});

export const { useLoginMutation, useMeQuery, useLogoutMutation } = authService;
