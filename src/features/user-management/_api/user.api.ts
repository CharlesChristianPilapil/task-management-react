import { laravelClient } from '@/features/shared/api';
import type { ApiResponse } from '@/features/shared/types';
import type { CreateUserPayload, UpdateUserPayload, User } from '../_types';

export const userApi = {
    list: () => laravelClient.get<ApiResponse<User[]>>('/users'),

    get: (userId: number) => laravelClient.get<ApiResponse<User>>(`/users/${userId}`),

    create: (payload: CreateUserPayload) =>
        laravelClient.post<ApiResponse<User>>('/users', payload),

    update: (userId: number, payload: UpdateUserPayload) =>
        laravelClient.put<ApiResponse<User>>(`/users/${userId}`, payload),

    toggleStatus: (userId: number) =>
        laravelClient.patch<ApiResponse<User>>(`/users/${userId}/status`),
};
