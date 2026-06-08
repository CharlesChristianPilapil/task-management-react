import { laravelClient } from '@/features/shared/api';
import type { ApiResponse, PaginatedData } from '@/features/shared/types';
import type { Task, TaskListParams } from '../_types';

export const taskApi = {
    myTasks: (params?: TaskListParams) =>
        laravelClient.get<ApiResponse<PaginatedData<Task, 'tasks'>>>('/tasks/mine', { params }),

    list: (teamId: number, params?: TaskListParams) =>
        laravelClient.get<ApiResponse<PaginatedData<Task, 'tasks'>>>(`/teams/${teamId}/tasks`, {
            params,
        }),

    get: (taskId: number) => laravelClient.get<ApiResponse<Task>>(`/tasks/${taskId}`),

    create: (teamId: number, payload: Partial<Task>) =>
        laravelClient.post<ApiResponse<Task>>(`/teams/${teamId}/tasks`, payload),

    update: (taskId: number, payload: Partial<Task>) =>
        laravelClient.patch<ApiResponse<Task>>(`/tasks/${taskId}`, payload),

    updateStatus: (taskId: number, status: Task['status']) =>
        laravelClient.patch<ApiResponse<Task>>(`/tasks/${taskId}/status`, { status }),

    remove: (taskId: number) => laravelClient.delete<ApiResponse<null>>(`/tasks/${taskId}`),
};
