import { BarChart3, CalendarClock, Users } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AnalyticsGridSkeleton,
    ProductivityTableSkeleton,
} from '@/features/dashboard/_components/DashboardSkeletons';
import { SectionState } from '@/features/dashboard';

import type { AnalyticsSummary, MemberProductivity, TeamProductivity } from '../_types';
import {
    formatCompletionHours,
    toMemberCompletedChartData,
    toProductivityChartData,
    toStatusChartData,
} from '../_utils/chart-data';
import { AnalyticsMetricCards } from './AnalyticsMetricCards';
import { CompletionRateBadge } from './CompletionRateBadge';
import {
    LazyChart,
    LazyMemberProductivityBarChart,
    LazyMemberWorkloadChart,
    LazyTaskStatusDonutChart,
} from './charts/lazy-charts';

type AnalyticsOverviewSectionProps = {
    summary: AnalyticsSummary | null;
    productivity: TeamProductivity | null;
    summaryLoading: boolean;
    summaryError: string | null;
    productivityLoading: boolean;
    productivityError: string | null;
};

export function AnalyticsOverviewSection({
    summary,
    productivity,
    summaryLoading,
    summaryError,
    productivityLoading,
    productivityError,
}: AnalyticsOverviewSectionProps) {
    const workloadData = productivity ? toMemberCompletedChartData(productivity.members) : [];
    const showWorkloadChart = !productivityLoading && !productivityError && workloadData.length > 0;

    return (
        <SectionState
            isLoading={summaryLoading}
            error={summaryError}
            isEmpty={!summary}
            skeleton={<AnalyticsGridSkeleton />}
        >
            {summary && (
                <div className="flex flex-col gap-6">
                    <AnalyticsMetricCards summary={summary} />

                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <BarChart3 className="size-4 text-muted-foreground" />
                                    Task status breakdown
                                </CardTitle>
                                <CardDescription>
                                    Completed vs pending tasks in the selected range.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <LazyChart height={260}>
                                    <LazyTaskStatusDonutChart data={toStatusChartData(summary)} />
                                </LazyChart>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <BarChart3 className="size-4 text-muted-foreground" />
                                    Member workload
                                </CardTitle>
                                <CardDescription>
                                    Completed vs still-open tasks per team member.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {productivityLoading ? (
                                    <ProductivityTableSkeleton />
                                ) : productivityError ? (
                                    <p className="text-sm text-destructive">{productivityError}</p>
                                ) : showWorkloadChart ? (
                                    <LazyChart height={260}>
                                        <LazyMemberWorkloadChart data={workloadData} />
                                    </LazyChart>
                                ) : (
                                    <p className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
                                        No workload data for this period.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </SectionState>
    );
}

type AnalyticsProductivitySectionProps = {
    productivity: TeamProductivity | null;
    isLoading: boolean;
    error: string | null;
};

function ProductivityTable({ members }: { members: MemberProductivity[] }) {
    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b bg-muted/40 text-left text-muted-foreground">
                        <th className="px-3 py-2 font-medium">Member</th>
                        <th className="px-3 py-2 font-medium">Tasks</th>
                        <th className="px-3 py-2 font-medium">Completed</th>
                        <th className="px-3 py-2 font-medium">Rate</th>
                        <th className="px-3 py-2 font-medium">Avg. time</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member.user_id ?? member.name} className="border-b last:border-0">
                            <td className="px-3 py-2.5 font-medium">{member.name}</td>
                            <td className="px-3 py-2.5">{member.task_count}</td>
                            <td className="px-3 py-2.5">{member.completed_count}</td>
                            <td className="px-3 py-2.5">
                                <CompletionRateBadge rate={member.completion_rate} />
                            </td>
                            <td className="px-3 py-2.5">
                                {formatCompletionHours(member.avg_completion_time)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function AnalyticsProductivitySection({
    productivity,
    isLoading,
    error,
}: AnalyticsProductivitySectionProps) {
    const chartData = productivity ? toProductivityChartData(productivity.members) : [];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    Team productivity
                </CardTitle>
                <CardDescription>
                    Per-member task counts, completion rates, and average completion time.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SectionState
                    isLoading={isLoading}
                    error={error}
                    isEmpty={!productivity || productivity.members.length === 0}
                    emptyMessage="No productivity data available."
                    skeleton={<ProductivityTableSkeleton />}
                >
                    {productivity && (
                        <div className="flex flex-col gap-6">
                            <LazyChart height={280}>
                                <LazyMemberProductivityBarChart data={chartData} />
                            </LazyChart>
                            <ProductivityTable members={productivity.members} />
                        </div>
                    )}
                </SectionState>
            </CardContent>
        </Card>
    );
}

export function AnalyticsDeadlinesSectionTitle() {
    return (
        <span className="flex items-center gap-2">
            <CalendarClock className="size-4 text-muted-foreground" />
            Upcoming deadlines
        </span>
    );
}
