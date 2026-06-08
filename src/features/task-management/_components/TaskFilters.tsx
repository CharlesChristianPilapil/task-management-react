import type { TaskListParams } from '../_types';
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from '../_utils/task-filter-options';

const selectClassName =
    'h-8 rounded-lg border border-border bg-background px-3 text-sm min-w-[9rem]';

type AssigneeOption = {
    id: number;
    name: string;
};

type TaskFiltersProps = {
    filters: Pick<TaskListParams, 'status' | 'priority' | 'assigned_to'>;
    onFilterChange: (filters: Partial<TaskListParams>) => void;
    assigneeOptions?: AssigneeOption[];
    showAssigneeFilter?: boolean;
};

export function TaskFilters({
    filters,
    onFilterChange,
    assigneeOptions = [],
    showAssigneeFilter = true,
}: TaskFiltersProps) {
    return (
        <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
                <label htmlFor="task-status-filter" className="text-xs font-medium text-muted-foreground">
                    Status
                </label>
                <select
                    id="task-status-filter"
                    value={filters.status ?? ''}
                    onChange={(event) =>
                        onFilterChange({
                            status: event.target.value
                                ? (event.target.value as TaskListParams['status'])
                                : undefined,
                        })
                    }
                    className={selectClassName}
                >
                    <option value="">All statuses</option>
                    {TASK_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="task-priority-filter" className="text-xs font-medium text-muted-foreground">
                    Priority
                </label>
                <select
                    id="task-priority-filter"
                    value={filters.priority ?? ''}
                    onChange={(event) =>
                        onFilterChange({
                            priority: event.target.value
                                ? (event.target.value as TaskListParams['priority'])
                                : undefined,
                        })
                    }
                    className={selectClassName}
                >
                    <option value="">All priorities</option>
                    {TASK_PRIORITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {showAssigneeFilter && (
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="task-assignee-filter"
                        className="text-xs font-medium text-muted-foreground"
                    >
                        Assigned to
                    </label>
                    <select
                        id="task-assignee-filter"
                        value={filters.assigned_to ?? ''}
                        onChange={(event) =>
                            onFilterChange({
                                assigned_to: event.target.value
                                    ? Number(event.target.value)
                                    : undefined,
                            })
                        }
                        className={selectClassName}
                    >
                        <option value="">All assignees</option>
                        {assigneeOptions.map((member) => (
                            <option key={member.id} value={member.id}>
                                {member.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}
