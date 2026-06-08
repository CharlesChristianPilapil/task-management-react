import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskSummary } from '@/features/analytics';
import useAuth from '@/hooks/useAuth';

import { AnalyticsGridSkeleton } from './DashboardSkeletons';
import { SectionState } from './SectionState';

type TaskSummaryPanelProps = {
    teamId: number | null;
};

export function TaskSummaryPanel({ teamId }: TaskSummaryPanelProps) {
    const { user } = useAuth();
    const canViewAnalytics = user?.role === 'admin' || user?.role === 'manager';
    const { summary, isLoading, error } = useTaskSummary(teamId, canViewAnalytics);

    if (!canViewAnalytics) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Task summary</CardTitle>
                <CardDescription>Analytics overview from the reporting service.</CardDescription>
            </CardHeader>
            <CardContent>
                <SectionState
                    isLoading={isLoading}
                    error={error}
                    isEmpty={!summary}
                    skeleton={<AnalyticsGridSkeleton />}
                >
                    {summary && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg border p-3">
                                <p className="text-xs text-muted-foreground">Total tasks</p>
                                <p className="text-xl font-semibold">{summary.total_tasks}</p>
                            </div>
                            <div className="rounded-lg border p-3">
                                <p className="text-xs text-muted-foreground">Completed</p>
                                <p className="text-xl font-semibold">{summary.completed_tasks}</p>
                            </div>
                            <div className="rounded-lg border p-3">
                                <p className="text-xs text-muted-foreground">Pending</p>
                                <p className="text-xl font-semibold">{summary.pending_tasks}</p>
                            </div>
                            <div className="rounded-lg border p-3">
                                <p className="text-xs text-muted-foreground">Avg. completion</p>
                                <p className="text-xl font-semibold">
                                    {summary.avg_completion_time !== null
                                        ? `${summary.avg_completion_time.toFixed(1)}h`
                                        : '—'}
                                </p>
                            </div>
                        </div>
                    )}
                </SectionState>
            </CardContent>
        </Card>
    );
}
