import { userApi } from '../_api';
import type { CreateUserPayload, UpdateUserPayload } from '../_types';

export const userService = {
    list: () => userApi.list().then((res) => res.data.data),

    get: (userId: number) => userApi.get(userId).then((res) => res.data.data),

    create: (payload: CreateUserPayload) => userApi.create(payload).then((res) => res.data.data),

    update: (userId: number, payload: UpdateUserPayload) =>
        userApi.update(userId, payload).then((res) => res.data.data),

    toggleStatus: (userId: number) => userApi.toggleStatus(userId).then((res) => res.data.data),
};
