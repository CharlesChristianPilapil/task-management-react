import { laravelClient } from '@/features/shared/api';
import type { ApiResponse, PaginatedData } from '@/features/shared/types';
import type { CreateUserPayload, UpdateUserPayload, User, UserListParams } from '../_types';

export const userApi = {
    list: (params?: UserListParams) =>
        laravelClient.get<ApiResponse<PaginatedData<User, 'users'>>>('/users', { params }),

    get: (userId: number) => laravelClient.get<ApiResponse<User>>(`/users/${userId}`),

    create: (payload: CreateUserPayload) =>
        laravelClient.post<ApiResponse<User>>('/users', payload),

    update: (userId: number, payload: UpdateUserPayload) =>
        laravelClient.patch<ApiResponse<User>>(`/users/${userId}`, payload),

    toggleStatus: (userId: number) =>
        laravelClient.patch<ApiResponse<User>>(`/users/${userId}/status`),
};
