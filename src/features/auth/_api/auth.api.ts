import { laravelClient } from '@/features/shared/api';
import type { ApiResponse } from '@/features/shared/types';
import type { AuthTokens, User } from '../_types';

export const authApi = {
    login: (email: string, password: string) =>
        laravelClient.post<ApiResponse<{ user: User; token: AuthTokens }>>('/auth/login', {
            email,
            password,
        }),

    me: () => laravelClient.get<ApiResponse<User>>('/auth/me'),

    logout: () => laravelClient.post<ApiResponse<null>>('/auth/logout'),
};
