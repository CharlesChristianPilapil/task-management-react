import type { Team } from '@/features/team-management';

import { SelectSkeleton } from './DashboardSkeletons';
import { SectionState } from './SectionState';

type TeamSelectorProps = {
    teams: Team[];
    isLoading: boolean;
    error: string | null;
    selectedTeamId: number | null;
    onTeamChange: (teamId: number) => void;
};

export function TeamSelector({
    teams,
    isLoading,
    error,
    selectedTeamId,
    onTeamChange,
}: TeamSelectorProps) {
    if (teams.length <= 1) {
        return null;
    }

    return (
        <SectionState isLoading={isLoading} error={error} skeleton={<SelectSkeleton />}>
            <div className="flex items-center gap-3">
                <label htmlFor="team-select" className="text-sm font-medium">
                    Team
                </label>
                <select
                    id="team-select"
                    value={selectedTeamId ?? ''}
                    onChange={(event) => onTeamChange(Number(event.target.value))}
                    className="h-8 rounded-lg border border-border bg-background px-3 text-sm"
                >
                    {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                            {team.name}
                        </option>
                    ))}
                </select>
            </div>
        </SectionState>
    );
}
