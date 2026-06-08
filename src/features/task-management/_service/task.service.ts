import { taskApi } from '../_api';
import type { Task } from '../_types';

export const taskService = {
    list: (teamId: number, params?: Record<string, string | number>) =>
        taskApi.list(teamId, params).then((res) => res.data.data),

    get: (taskId: number) => taskApi.get(taskId).then((res) => res.data.data),

    create: (teamId: number, payload: Partial<Task>) =>
        taskApi.create(teamId, payload).then((res) => res.data.data),

    update: (taskId: number, payload: Partial<Task>) =>
        taskApi.update(taskId, payload).then((res) => res.data.data),

    updateStatus: (taskId: number, status: Task['status']) =>
        taskApi.updateStatus(taskId, status).then((res) => res.data.data),

    remove: (taskId: number) => taskApi.remove(taskId).then((res) => res.data.data),
};
