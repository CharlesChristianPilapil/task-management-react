import { useMemo, useState } from 'react';

import {
    DashboardHeader,
    MyTasksList,
    MyTaskStats,
    TaskSummaryPanel,
    TeamProductivityPanel,
    TeamSelector,
    TeamStatsPanel,
} from '@/features/dashboard';
import { useTeams } from '@/features/team-management';

export function DashboardPage() {
    const { teams, isLoading: teamsLoading, error: teamsError } = useTeams();
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

    const resolvedTeamId = useMemo(() => {
        if (selectedTeamId !== null && teams.some((team) => team.id === selectedTeamId)) {
            return selectedTeamId;
        }

        return teams[0]?.id ?? null;
    }, [teams, selectedTeamId]);

    const selectedTeam = teams.find((team) => team.id === resolvedTeamId) ?? null;

    return (
        <div className="flex flex-col gap-6">
            <DashboardHeader />
            <TeamSelector
                teams={teams}
                isLoading={teamsLoading}
                error={teamsError}
                selectedTeamId={resolvedTeamId}
                onTeamChange={setSelectedTeamId}
            />
            <MyTaskStats />

            <div className="grid gap-6 lg:grid-cols-2">
                <MyTasksList />
                <TeamStatsPanel
                    teamId={resolvedTeamId}
                    selectedTeam={selectedTeam}
                    teamsLoading={teamsLoading}
                    teamsError={teamsError}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <TaskSummaryPanel teamId={resolvedTeamId} />
                <TeamProductivityPanel teamId={resolvedTeamId} />
            </div>
        </div>
    );
}
