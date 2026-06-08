import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { MemberProductivity } from '@/features/analytics';
import { useTeamProductivity } from '@/features/analytics';
import useAuth from '@/hooks/useAuth';

import { formatCompletionRate } from '../_utils/task-display';
import { ProductivityTableSkeleton } from './DashboardSkeletons';
import { SectionState } from './SectionState';

type TeamProductivityPanelProps = {
    teamId: number | null;
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
                        <th className="pb-2 font-medium">Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member.user_id ?? member.name} className="border-b last:border-0">
                            <td className="py-2 pr-4">{member.name}</td>
                            <td className="py-2 pr-4">{member.task_count}</td>
                            <td className="py-2 pr-4">{member.completed_count}</td>
                            <td className="py-2">{formatCompletionRate(member.completion_rate)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function TeamProductivityPanel({ teamId }: TeamProductivityPanelProps) {
    const { user } = useAuth();
    const canViewAnalytics = user?.role === 'admin' || user?.role === 'manager';
    const { productivity, isLoading, error } = useTeamProductivity(teamId, canViewAnalytics);

    if (!canViewAnalytics) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Member productivity</CardTitle>
                <CardDescription>Per-member completion rates from analytics.</CardDescription>
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
