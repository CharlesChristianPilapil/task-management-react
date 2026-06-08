import { Users } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Team } from '@/features/team-management';
import { useTeamTasks } from '@/features/task-management';

import { computeTaskStats } from '../_utils';
import { StatsGridSkeleton } from './DashboardSkeletons';
import { SectionState } from './SectionState';

type TeamStatsPanelProps = {
    teamId: number | null;
    selectedTeam: Team | null;
    teamsLoading: boolean;
    teamsError: string | null;
};

export function TeamStatsPanel({
    teamId,
    selectedTeam,
    teamsLoading,
    teamsError,
}: TeamStatsPanelProps) {
    const { tasks, isLoading, error } = useTeamTasks(teamId);
    const stats = computeTaskStats(tasks);
    const isWaitingForTeam = teamsLoading && !teamId;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Team stats</CardTitle>
                <CardDescription>
                    {selectedTeam
                        ? `Task breakdown for ${selectedTeam.name}`
                        : 'Select a team to view stats'}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <SectionState
                    isLoading={isWaitingForTeam || isLoading}
                    error={teamsError ?? error}
                    skeleton={<StatsGridSkeleton />}
                >
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg border p-3">
                            <p className="text-xs text-muted-foreground">Total tasks</p>
                            <p className="text-xl font-semibold">{stats.total}</p>
                        </div>
                        <div className="rounded-lg border p-3">
                            <p className="text-xs text-muted-foreground">Completed</p>
                            <p className="text-xl font-semibold">{stats.completed}</p>
                        </div>
                        <div className="rounded-lg border p-3">
                            <p className="text-xs text-muted-foreground">Pending</p>
                            <p className="text-xl font-semibold">{stats.pending}</p>
                        </div>
                        <div className="rounded-lg border p-3">
                            <p className="text-xs text-muted-foreground">In progress</p>
                            <p className="text-xl font-semibold">{stats.in_progress}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border p-3 text-sm text-muted-foreground">
                        <Users className="size-4" />
                        <span>
                            {selectedTeam?.members_count ?? '—'} members in{' '}
                            {selectedTeam?.name ?? 'this team'}
                        </span>
                    </div>
                </SectionState>
            </CardContent>
        </Card>
    );
}
