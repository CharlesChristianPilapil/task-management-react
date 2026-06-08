import {
    createApi,
    fetchBaseQuery,
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { env } from '@/config/env';
import { storage } from '@/features/shared/utils/storage';
import { logout } from '@/slices/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: env.laravelApiUrl,
    prepareHeaders: (headers) => {
        const token = storage.getToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        headers.set('Accept', 'application/json');
        return headers;
    },
});

const baseQueryWithReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions,
) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        storage.removeToken();
        api.dispatch(logout());
    }

    return result;
};

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReAuth,
    tagTypes: ['Auth', 'Users', 'Teams', 'Tasks', 'Analytics'],
    endpoints: () => ({}),
});
