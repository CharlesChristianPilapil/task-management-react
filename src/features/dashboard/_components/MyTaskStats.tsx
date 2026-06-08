import type { ReactNode } from 'react';
import { CheckCircle2, Clock, ListTodo } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMyTasks } from '@/features/task-management';

import { computeTaskStats } from '../_utils';
import { StatCardsSkeleton } from './DashboardSkeletons';
import { SectionState } from './SectionState';

function StatCard({
    title,
    value,
    description,
    icon,
}: {
    title: string;
    value: number | string;
    description: string;
    icon: ReactNode;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-semibold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

export function MyTaskStats() {
    const { tasks, isLoading, error } = useMyTasks();
    const stats = computeTaskStats(tasks);

    return (
        <SectionState isLoading={isLoading} error={error} skeleton={<StatCardsSkeleton />}>
            <section className="grid gap-4 sm:grid-cols-3">
                <StatCard
                    title="My tasks"
                    value={stats.total}
                    description="Assigned to you"
                    icon={<ListTodo className="size-4" />}
                />
                <StatCard
                    title="In progress"
                    value={stats.in_progress}
                    description="Your active tasks"
                    icon={<Clock className="size-4" />}
                />
                <StatCard
                    title="Completed"
                    value={stats.completed}
                    description="Your finished tasks"
                    icon={<CheckCircle2 className="size-4" />}
                />
            </section>
        </SectionState>
    );
}
