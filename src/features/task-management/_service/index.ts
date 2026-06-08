import type { ApiResponse, PaginatedData } from '@/features/shared/types';
import { invalidateOnMutationSuccess } from '@/features/shared/utils/invalidate-on-mutation-success';
import { api } from '@/services/BaseApiService';

import type { Task, TaskListParams, TaskListResult } from '../_types';

type TeamTasksArgs = {
    teamId: number;
} & TaskListParams;

type CreateTaskPayload = {
    title: string;
    description?: string | null;
    priority: Task['priority'];
    assigned_to?: number | null;
    due_date?: string | null;
};

type UpdateTaskPayload = Partial<CreateTaskPayload>;

function transformTaskListResponse(
    response: ApiResponse<PaginatedData<Task, 'tasks'>>,
): TaskListResult {
    return {
        tasks: response.data.tasks,
        pagination: response.data.pagination,
    };
}

function taskListTags(result: TaskListResult | undefined, listId: string) {
    if (!result) {
        return [{ type: 'Tasks' as const, id: listId }];
    }

    return [
        { type: 'Tasks' as const, id: listId },
        ...result.tasks.map(({ id }) => ({ type: 'Tasks' as const, id })),
    ];
}

export const taskService = api.injectEndpoints({
    endpoints: (builder) => ({
        myTasks: builder.query<TaskListResult, TaskListParams | void>({
            query: (params) => ({
                url: '/tasks/mine',
                params: params ?? {},
            }),
            transformResponse: transformTaskListResponse,
            providesTags: (result) => taskListTags(result, 'MY_LIST'),
        }),

        teamTasks: builder.query<TaskListResult, TeamTasksArgs>({
            query: ({ teamId, ...params }) => ({
                url: `/teams/${teamId}/tasks`,
                params,
            }),
            transformResponse: transformTaskListResponse,
            providesTags: (result, _error, { teamId }) =>
                taskListTags(result, `TEAM_LIST_${teamId}`),
        }),

        getTask: builder.query<Task, number>({
            query: (taskId) => `/tasks/${taskId}`,
            transformResponse: (response: ApiResponse<Task>) => response.data,
            providesTags: (_result, _error, taskId) => [{ type: 'Tasks', id: taskId }],
        }),

        createTask: builder.mutation<Task, { teamId: number; payload: CreateTaskPayload }>({
            query: ({ teamId, payload }) => ({
                url: `/teams/${teamId}/tasks`,
                method: 'POST',
                body: payload,
            }),
            transformResponse: (response: ApiResponse<Task>) => response.data,
            onQueryStarted: invalidateOnMutationSuccess((_result, { teamId }) => [
                { type: 'Tasks', id: 'MY_LIST' },
                { type: 'Tasks', id: `TEAM_LIST_${teamId}` },
            ]),
        }),

        updateTask: builder.mutation<Task, { taskId: number; payload: UpdateTaskPayload }>({
            query: ({ taskId, payload }) => ({
                url: `/tasks/${taskId}`,
                method: 'PATCH',
                body: payload,
            }),
            transformResponse: (response: ApiResponse<Task>) => response.data,
            onQueryStarted: invalidateOnMutationSuccess((result, { taskId }) => [
                { type: 'Tasks', id: taskId },
                { type: 'Tasks', id: 'MY_LIST' },
                ...(result ? [{ type: 'Tasks' as const, id: `TEAM_LIST_${(result as Task).team_id}` }] : []),
            ]),
        }),

        updateTaskStatus: builder.mutation<Task, { taskId: number; status: Task['status'] }>({
            query: ({ taskId, status }) => ({
                url: `/tasks/${taskId}/status`,
                method: 'PATCH',
                body: { status },
            }),
            transformResponse: (response: ApiResponse<Task>) => response.data,
            onQueryStarted: invalidateOnMutationSuccess((result, { taskId }) => [
                { type: 'Tasks', id: taskId },
                { type: 'Tasks', id: 'MY_LIST' },
                ...(result ? [{ type: 'Tasks' as const, id: `TEAM_LIST_${(result as Task).team_id}` }] : []),
            ]),
        }),

        deleteTask: builder.mutation<null, number>({
            query: (taskId) => ({
                url: `/tasks/${taskId}`,
                method: 'DELETE',
            }),
            transformResponse: (response: ApiResponse<null>) => response.data,
            onQueryStarted: invalidateOnMutationSuccess((_result, taskId) => [
                { type: 'Tasks', id: taskId },
                { type: 'Tasks', id: 'MY_LIST' },
                { type: 'Tasks' },
            ]),
        }),
    }),
});

export const {
    useMyTasksQuery,
    useTeamTasksQuery,
    useGetTaskQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useUpdateTaskStatusMutation,
    useDeleteTaskMutation,
} = taskService;
