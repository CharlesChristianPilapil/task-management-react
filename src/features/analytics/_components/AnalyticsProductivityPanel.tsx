import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductivityTableSkeleton } from '@/features/dashboard/_components/DashboardSkeletons';
import { SectionState } from '@/features/dashboard';
import { formatCompletionRate } from '@/features/dashboard/_utils/task-display';

import type { MemberProductivity } from '../_types';
import { useTeamProductivity } from '../_hooks/useTeamProductivity';

type AnalyticsProductivityPanelProps = {
    teamId: number | null;
    dateFrom?: string;
    dateTo?: string;
};

function ProductivityTable({ members }: { members: MemberProductivity[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-2 pr-4 font-medium">Member</th>
                        <th className="pb-2 pr-4 font-medium">Tasks</th>
                        <th className="pb-2 pr-4 font-medium">Completed</th>
                        <th className="pb-2 pr-4 font-medium">Rate</th>
                        <th className="pb-2 font-medium">Avg. time</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member.user_id ?? member.name} className="border-b last:border-0">
                            <td className="py-2 pr-4">{member.name}</td>
                            <td className="py-2 pr-4">{member.task_count}</td>
                            <td className="py-2 pr-4">{member.completed_count}</td>
                            <td className="py-2 pr-4">{formatCompletionRate(member.completion_rate)}</td>
                            <td className="py-2">
                                {member.avg_completion_time !== null
                                    ? `${member.avg_completion_time.toFixed(1)}h`
                                    : '—'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function AnalyticsProductivityPanel({
    teamId,
    dateFrom,
    dateTo,
}: AnalyticsProductivityPanelProps) {
    const { productivity, isLoading, error } = useTeamProductivity(
        teamId,
        true,
        dateFrom,
        dateTo,
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Team productivity</CardTitle>
                <CardDescription>Per-member task counts, completion rates, and average time.</CardDescription>
            </CardHeader>
            <CardContent>
                <SectionState
                    isLoading={isLoading}
                    error={error}
                    isEmpty={!productivity || productivity.members.length === 0}
                    emptyMessage="No productivity data available."
                    skeleton={<ProductivityTableSkeleton />}
                >
                    {productivity && <ProductivityTable members={productivity.members} />}
                </SectionState>
            </CardContent>
        </Card>
    );
}
