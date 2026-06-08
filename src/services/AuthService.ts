import type { ApiResponse } from '@/features/shared/types';
import type { AuthTokens, User } from '@/features/auth';

import { api } from './BaseApiService';

type LoginPayload = {
    email: string;
    password: string;
};

type LoginData = {
    user: User;
    token: AuthTokens;
};

export const authService = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginData, LoginPayload>({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
            transformResponse: (response: ApiResponse<LoginData>) => response.data,
            invalidatesTags: ['Auth'],
        }),
        me: builder.query<User, void>({
            query: () => '/auth/me',
            transformResponse: (response: ApiResponse<User>) => response.data,
            providesTags: ['Auth'],
        }),
        logout: builder.mutation<null, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            transformResponse: (response: ApiResponse<null>) => response.data,
            invalidatesTags: ['Auth'],
        }),
    }),
});

export const { useLoginMutation, useMeQuery, useLogoutMutation } = authService;
