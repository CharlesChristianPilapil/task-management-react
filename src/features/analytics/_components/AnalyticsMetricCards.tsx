import type { AnalyticsSummary } from '../_types';
import { formatCompletionHours, getCompletionPercentage } from '../_utils/chart-data';

type AnalyticsMetricCardsProps = {
    summary: AnalyticsSummary;
};

type MetricCardProps = {
    label: string;
    value: string | number;
    hint?: string;
};

function MetricCard({ label, value, hint }: MetricCardProps) {
    return (
        <div className="rounded-xl border bg-muted/30 p-4 text-center">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
            {hint && <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>}
        </div>
    );
}

export function AnalyticsMetricCards({ summary }: AnalyticsMetricCardsProps) {
    const completionPct = getCompletionPercentage(summary);

    return (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total tasks" value={summary.total_tasks} />
            <MetricCard
                label="Completed"
                value={summary.completed_tasks}
                hint={`${completionPct}% of total`}
            />
            <MetricCard label="Pending" value={summary.pending_tasks} />
            <MetricCard
                label="Avg completion"
                value={formatCompletionHours(summary.avg_completion_time)}
            />
        </div>
    );
}
