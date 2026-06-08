import { Calendar } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionState } from '@/features/dashboard';
import { formatDueDate, priorityStyles, statusStyles } from '@/features/task-management';
import type { TaskPriority, TaskStatus } from '@/features/task-management';

import type { UpcomingDeadlines } from '../_types';
import { getMemberInitials } from '../_utils/member-display';
import { AnalyticsDeadlinesSectionTitle } from './AnalyticsChartsSection';

type UpcomingDeadlinesPanelProps = {
    deadlines: UpcomingDeadlines | null;
    isLoading: boolean;
    error: string | null;
};

function DeadlinesSkeleton() {
    return (
        <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-xl" />
            ))}
        </div>
    );
}

function DeadlinesContent({ deadlines }: { deadlines: UpcomingDeadlines }) {
    const flatTasks = deadlines.members.flatMap((member) =>
        member.tasks.map((task) => ({
            ...task,
            memberName: member.name,
        })),
    );

    flatTasks.sort(
        (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
    );

    if (flatTasks.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                No tasks due in the next {deadlines.window_days} days.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {flatTasks.map((task) => (
                <div
                    key={task.id}
                    className="flex items-center justify-between gap-3 rounded-xl border bg-muted/20 px-3 py-3"
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {getMemberInitials(task.memberName)}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate font-medium">{task.title}</p>
                            <p className="text-xs text-muted-foreground">{task.memberName}</p>
                        </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="size-3.5" />
                            {formatDueDate(task.due_date)}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span
                                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyles[task.status as TaskStatus]}`}
                            >
                                {task.status.replace('_', ' ')}
                            </span>
                            <span
                                className={`text-[11px] font-medium capitalize ${priorityStyles[task.priority as TaskPriority]}`}
                            >
                                {task.priority}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function UpcomingDeadlinesPanel({ deadlines, isLoading, error }: UpcomingDeadlinesPanelProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <AnalyticsDeadlinesSectionTitle />
                </CardTitle>
                <CardDescription>
                    Tasks due in the next 7 days, sorted by due date.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SectionState
                    isLoading={isLoading}
                    error={error}
                    isEmpty={!deadlines}
                    skeleton={<DeadlinesSkeleton />}
                >
                    {deadlines && <DeadlinesContent deadlines={deadlines} />}
                </SectionState>
            </CardContent>
        </Card>
    );
}
