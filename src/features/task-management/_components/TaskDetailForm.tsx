import { useState } from 'react';

import { InputField, SelectField, TextareaField } from '@/components/Fields';
import { Button } from '@/components/ui/button';
import type { TeamMember } from '@/features/team-management';

import type { Task, TaskPriority, TaskStatus } from '../_types';
import { formatDateTime } from '../_utils/task-display';
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from '../_utils/task-filter-options';
import { getAllowedStatusOptions } from '../_utils/status-transitions';

function toDateInputValue(value: string | null) {
    return value ? value.slice(0, 10) : '';
}

type TaskDetailFormProps = {
    task: Task;
    members: TeamMember[];
    canEditAssignee: boolean;
    canDelete: boolean;
    isSaving: boolean;
    isUpdatingStatus: boolean;
    isDeleting: boolean;
    saveError: string | null;
    onSave: (payload: {
        title: string;
        description: string | null;
        priority: TaskPriority;
        due_date: string | null;
        assigned_to?: number | null;
    }) => Promise<void>;
    onStatusChange: (status: TaskStatus) => Promise<void>;
    onDelete: () => Promise<void>;
};

export function TaskDetailForm({
    task,
    members,
    canEditAssignee,
    canDelete,
    isSaving,
    isUpdatingStatus,
    isDeleting,
    saveError,
    onSave,
    onStatusChange,
    onDelete,
}: TaskDetailFormProps) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description ?? '');
    const [priority, setPriority] = useState(task.priority);
    const [dueDate, setDueDate] = useState(toDateInputValue(task.due_date));
    const [assignedTo, setAssignedTo] = useState(
        task.assigned_to !== null ? String(task.assigned_to) : '',
    );
    const [status, setStatus] = useState(task.status);
    const [prevTaskStatus, setPrevTaskStatus] = useState(task.status);

    if (task.status !== prevTaskStatus) {
        setPrevTaskStatus(task.status);
        setStatus(task.status);
    }

    const statusOptions = getAllowedStatusOptions(status);
    const isBusy = isSaving || isUpdatingStatus || isDeleting;

    const isDirty =
        title.trim() !== task.title ||
        (description.trim() || null) !== (task.description ?? null) ||
        priority !== task.priority ||
        (dueDate || null) !== (toDateInputValue(task.due_date) || null) ||
        (canEditAssignee &&
            (assignedTo ? Number(assignedTo) : null) !== task.assigned_to);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const payload = {
            title: title.trim(),
            description: description.trim() || null,
            priority,
            due_date: dueDate || null,
        };

        if (canEditAssignee) {
            await onSave({
                ...payload,
                assigned_to: assignedTo ? Number(assignedTo) : null,
            });
            return;
        }

        await onSave(payload);
    };

    const handleStatusChange = async (nextStatus: TaskStatus) => {
        const previousStatus = status;
        setStatus(nextStatus);

        try {
            await onStatusChange(nextStatus);
        } catch {
            setStatus(previousStatus);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this task?')) {
            return;
        }

        await onDelete();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <p className="text-xs text-muted-foreground">
                Created {formatDateTime(task.created_at)}
                {task.creator ? ` by ${task.creator.name}` : ''}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
                <InputField
                    label="Title"
                    name="title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                />

                <SelectField
                    label="Status"
                    name="status"
                    value={status}
                    disabled={statusOptions.length <= 1 || isUpdatingStatus}
                    onChange={(event) => handleStatusChange(event.target.value as TaskStatus)}
                >
                    {statusOptions.map((value) => {
                        const label =
                            TASK_STATUS_OPTIONS.find((option) => option.value === value)?.label ??
                            value;

                        return (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        );
                    })}
                </SelectField>
            </div>

            <TextareaField
                label="Description"
                name="description"
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
            />

            <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
                <SelectField
                    label="Priority"
                    name="priority"
                    value={priority}
                    onChange={(event) => setPriority(event.target.value as TaskPriority)}
                >
                    {TASK_PRIORITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </SelectField>

                <InputField
                    label="Due date"
                    name="due_date"
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                />
            </div>

            {canEditAssignee && (
                <SelectField
                    label="Assigned to"
                    name="assigned_to"
                    value={assignedTo}
                    onChange={(event) => setAssignedTo(event.target.value)}
                >
                    <option value="">Unassigned</option>
                    {members.map((member) => (
                        <option key={member.id} value={member.id}>
                            {member.name}
                        </option>
                    ))}
                </SelectField>
            )}

            {!canEditAssignee && task.assignee && (
                <div className="text-sm">
                    <span className="text-muted-foreground">Assigned to: </span>
                    <span>{task.assignee.name}</span>
                </div>
            )}

            {saveError && <p className="text-sm text-destructive">{saveError}</p>}

            <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={isBusy || !title.trim() || !isDirty}>
                    {isSaving ? 'Saving...' : 'Save changes'}
                </Button>
                {canDelete && (
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={isBusy}
                        onClick={handleDelete}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete task'}
                    </Button>
                )}
            </div>
        </form>
    );
}
