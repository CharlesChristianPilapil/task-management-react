import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { InputField, SelectField, TextareaField } from '@/components/Fields';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useCreateTaskMutation } from '@/features/task-management';
import { TASK_PRIORITY_OPTIONS } from '@/features/task-management/_utils/task-filter-options';
import { getApiErrorMessage } from '@/features/shared/utils/get-api-error-message';

import { CREATE_TASK_SCHEMA, type CreateTaskFormValues } from '../_schema/index.schema';
import type { Team, TeamMember } from '../_types';

type AddTaskDialogProps = {
    open: boolean;
    team: Team | null;
    members: TeamMember[];
    onClose: () => void;
};

export function AddTaskDialog({ open, team, members, onClose }: AddTaskDialogProps) {
    const [createTask, { isLoading }] = useCreateTaskMutation();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateTaskFormValues>({
        resolver: zodResolver(CREATE_TASK_SCHEMA),
        defaultValues: {
            title: '',
            description: '',
            priority: 'medium',
            assigned_to: '',
            due_date: '',
        },
    });

    const handleClose = () => {
        if (isLoading) {
            return;
        }

        reset();
        onClose();
    };

    const onSubmit = async (values: CreateTaskFormValues) => {
        if (!team) {
            return;
        }

        const toastId = toast.loading('Creating task...');

        try {
            await createTask({
                teamId: team.id,
                payload: {
                    title: values.title.trim(),
                    description: values.description?.trim() || null,
                    priority: values.priority,
                    assigned_to: values.assigned_to ? Number(values.assigned_to) : null,
                    due_date: values.due_date || null,
                },
            }).unwrap();

            toast.success('Task created', { id: toastId });
            reset();
            onClose();
        } catch (error) {
            toast.error(getApiErrorMessage(error, 'Failed to create task.'), { id: toastId });
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            title="Add task"
            description={team ? `Create a new task for ${team.name}.` : undefined}
            closeDisabled={isLoading}
        >
            <form key={team?.id} onSubmit={handleSubmit(onSubmit)} noValidate>
                <fieldset disabled={isLoading}>
                    <div className="flex flex-col gap-4">
                        <InputField
                            label="Title"
                            placeholder="Task title"
                            error={errors.title?.message}
                            {...register('title')}
                        />

                        <TextareaField
                            label="Description"
                            rows={3}
                            placeholder="Optional description"
                            error={errors.description?.message}
                            {...register('description')}
                        />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <SelectField
                                label="Priority"
                                error={errors.priority?.message}
                                {...register('priority')}
                            >
                                {TASK_PRIORITY_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </SelectField>

                            <InputField
                                label="Due date"
                                type="date"
                                error={errors.due_date?.message}
                                {...register('due_date')}
                            />
                        </div>

                        <SelectField
                            label="Assigned to"
                            error={errors.assigned_to?.message}
                            {...register('assigned_to')}
                        >
                            <option value="">Unassigned</option>
                            {members.map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.name}
                                </option>
                            ))}
                        </SelectField>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isLoading}
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">{isLoading ? 'Creating...' : 'Create task'}</Button>
                        </div>
                    </div>
                </fieldset>
            </form>
        </Dialog>
    );
}
