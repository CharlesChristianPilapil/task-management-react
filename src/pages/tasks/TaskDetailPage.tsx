import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/config/routes';
import { SectionState } from '@/features/dashboard';
import {
    TaskDetailForm,
    useDeleteTaskMutation,
    useGetTaskQuery,
    useUpdateTaskMutation,
    useUpdateTaskStatusMutation,
} from '@/features/task-management';
import type { TaskPriority, TaskStatus } from '@/features/task-management';
import { getApiErrorMessage } from '@/features/shared/utils/get-api-error-message';
import { useGetTeamQuery } from '@/features/team-management';
import useAuth from '@/hooks/useAuth';

function TaskDetailSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    );
}

export function TaskDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const taskId = Number(id);
    const [saveError, setSaveError] = useState<string | null>(null);

    const { data: task, isLoading, error } = useGetTaskQuery(taskId, {
        skip: !taskId,
    });
    const { data: team } = useGetTeamQuery(task?.team_id ?? 0, {
        skip: !task?.team_id,
    });

    const [updateTask, { isLoading: isSaving }] = useUpdateTaskMutation();
    const [updateTaskStatus, { isLoading: isUpdatingStatus }] = useUpdateTaskStatusMutation();
    const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

    const loadError = error ? getApiErrorMessage(error, 'Failed to load task.') : null;
    const canEditAssignee = user?.role === 'admin' || user?.role === 'manager';
    const canDelete = user?.role !== 'team_member' && (user?.role === 'admin' || task?.created_by === user?.id);

    const handleSave = async (payload: {
        title: string;
        description: string | null;
        priority: TaskPriority;
        due_date: string | null;
        assigned_to?: number | null;
    }) => {
        if (!task) return;

        setSaveError(null);
        const toastId = toast.loading('Saving task...');

        try {
            await updateTask({ taskId: task.id, payload }).unwrap();
            toast.success('Task updated', { id: toastId });
        } catch (err) {
            const message = getApiErrorMessage(err, 'Failed to update task.');
            setSaveError(message);
            toast.error(message, { id: toastId });
        }
    };

    const handleStatusChange = async (status: TaskStatus) => {
        if (!task) return;

        const toastId = toast.loading('Updating status...');

        try {
            await updateTaskStatus({ taskId: task.id, status }).unwrap();
            toast.success('Status updated', { id: toastId });
        } catch (err) {
            toast.error(getApiErrorMessage(err, 'Failed to update status.'), { id: toastId });
            throw err;
        }
    };

    const handleDelete = async () => {
        if (!task) return;

        const toastId = toast.loading('Deleting task...');

        try {
            await deleteTask(task.id).unwrap();
            toast.success('Task deleted', { id: toastId });
            navigate(ROUTES.TASKS);
        } catch (err) {
            toast.error(getApiErrorMessage(err, 'Failed to delete task.'), { id: toastId });
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Task detail</h1>
                    <p className="text-sm text-muted-foreground">View and edit this task.</p>
                </div>
                <Button variant="outline" onClick={() => navigate(ROUTES.TASKS)}>
                    Back to tasks
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{task?.title ?? 'Task'}</CardTitle>
                    <CardDescription>
                        {team ? `Team: ${team.name}` : 'Loading task details...'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SectionState
                        isLoading={isLoading}
                        error={loadError}
                        isEmpty={!isLoading && !loadError && !task}
                        emptyMessage="Task not found."
                        skeleton={<TaskDetailSkeleton />}
                    >
                        {task && (
                            <TaskDetailForm
                                key={`${task.id}-${task.updated_at}`}
                                task={task}
                                members={team?.members ?? []}
                                canEditAssignee={canEditAssignee}
                                canDelete={!!canDelete}
                                isSaving={isSaving}
                                isUpdatingStatus={isUpdatingStatus}
                                isDeleting={isDeleting}
                                saveError={saveError}
                                onSave={handleSave}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDelete}
                            />
                        )}
                    </SectionState>
                </CardContent>
            </Card>
        </div>
    );
}
