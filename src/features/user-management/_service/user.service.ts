import { userApi } from '../_api';
import type { CreateUserPayload, UpdateUserPayload, UserListParams, UserListResult } from '../_types';

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
