import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { ROUTES } from '@/config/routes';
import { AnalyticsDashboard, canAccessAnalytics } from '@/features/analytics';
import { useTeams } from '@/features/team-management';
import useAuth from '@/hooks/useAuth';

export function AnalyticsPage() {
    const { user } = useAuth();
    const { teams, isLoading: teamsLoading, error: teamsError } = useTeams();
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [exportOpen, setExportOpen] = useState(false);

    const resolvedTeamId = useMemo(() => {
        if (selectedTeamId !== null && teams.some((team) => team.id === selectedTeamId)) {
            return selectedTeamId;
        }

        return teams[0]?.id ?? null;
    }, [teams, selectedTeamId]);

    if (!canAccessAnalytics(user)) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return (
        <AnalyticsDashboard
            teamId={resolvedTeamId}
            teams={teams}
            teamsLoading={teamsLoading}
            teamsError={teamsError}
            selectedTeamId={resolvedTeamId}
            onTeamChange={setSelectedTeamId}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            exportOpen={exportOpen}
            onExportOpen={() => setExportOpen(true)}
            onExportClose={() => setExportOpen(false)}
        />
    );
}
