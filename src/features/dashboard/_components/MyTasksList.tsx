import { Link } from 'react-router-dom';

import { Pagination } from '@/components/ui/pagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/config/routes';
import { useMyTasksList } from '@/features/task-management';

import { formatDueDate, priorityStyles, statusStyles } from '../_utils/task-display';
import { TaskListSkeleton } from './DashboardSkeletons';
import { SectionState } from './SectionState';

export function MyTasksList() {
    const { tasks, pagination, isLoading, isFetching, error, setPage } = useMyTasksList();

    return (
        <Card>
            <CardHeader>
                <CardTitle>My tasks</CardTitle>
                <CardDescription>Tasks currently assigned to you across your teams.</CardDescription>
            </CardHeader>
            <CardContent>
                <SectionState
                    isLoading={isLoading}
                    error={error}
                    isEmpty={tasks.length === 0}
                    emptyMessage="You have no assigned tasks."
                    skeleton={<TaskListSkeleton />}
                >
                    <div className="flex flex-col gap-4">
                        <ul className="flex flex-col gap-3">
                            {tasks.map((task) => (
                                <li
                                    key={task.id}
                                    className="flex items-start justify-between gap-4 rounded-lg border p-3"
                                >
                                    <div className="min-w-0 flex-1">
                                        <Link
                                            to={ROUTES.TASK_DETAIL.replace(':id', String(task.id))}
                                            className="font-medium hover:underline"
                                        >
                                            {task.title}
                                        </Link>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Due {formatDueDate(task.due_date)}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 flex-col items-end gap-1">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[task.status]}`}
                                        >
                                            {task.status_label ?? task.status.replace('_', ' ')}
                                        </span>
                                        <span
                                            className={`text-xs capitalize ${priorityStyles[task.priority]}`}
                                        >
                                            {task.priority_label ?? task.priority}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <Pagination
                            pagination={pagination}
                            onPageChange={setPage}
                            isLoading={isFetching}
                        />
                    </div>
                </SectionState>
            </CardContent>
        </Card>
    );
}

