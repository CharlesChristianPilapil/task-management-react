import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsGridSkeleton } from '@/features/dashboard/_components/DashboardSkeletons';
import { SectionState } from '@/features/dashboard';

import { useTaskSummary } from '../_hooks/useTaskSummary';

type AnalyticsSummaryPanelProps = {
    teamId: number | null;
    dateFrom?: string;
    dateTo?: string;
};

export function AnalyticsSummaryPanel({ teamId, dateFrom, dateTo }: AnalyticsSummaryPanelProps) {
    const { summary, isLoading, error } = useTaskSummary(teamId, true, dateFrom, dateTo);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Task summary</CardTitle>
                <CardDescription>Completion metrics for the selected team and date range.</CardDescription>
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