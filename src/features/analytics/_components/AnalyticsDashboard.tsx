import { BarChart3, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SectionState } from '@/features/dashboard';
import { SelectSkeleton } from '@/features/dashboard/_components/DashboardSkeletons';
import type { Team } from '@/features/team-management';

import { useTaskSummary } from '../_hooks/useTaskSummary';
import { useTeamProductivity } from '../_hooks/useTeamProductivity';
import { useUpcomingDeadlines } from '../_hooks/useUpcomingDeadlines';
import { AnalyticsDateRangeFilter } from './AnalyticsDateRangeFilter';
import {
    AnalyticsOverviewSection,
    AnalyticsProductivitySection,
} from './AnalyticsChartsSection';
import { ExportTasksDialog } from './ExportTasksDialog';
import { UpcomingDeadlinesPanel } from './UpcomingDeadlinesPanel';

type AnalyticsDashboardProps = {
    teamId: number | null;
    teams: Team[];
    teamsLoading: boolean;
    teamsError: string | null;
    selectedTeamId: number | null;
    onTeamChange: (teamId: number) => void;
    dateFrom: string;
    dateTo: string;
    onDateFromChange: (value: string) => void;
    onDateToChange: (value: string) => void;
    exportOpen: boolean;
    onExportOpen: () => void;
    onExportClose: () => void;
};

function toOptionalDate(value: string) {
    return value.length > 0 ? value : undefined;
}

function TeamFilterBar({
    teams,
    teamsLoading,
    teamsError,
    selectedTeamId,
    onTeamChange,
    dateFrom,
    dateTo,
    onDateFromChange,
    onDateToChange,
}: Pick<
    AnalyticsDashboardProps,
    | 'teams'
    | 'teamsLoading'
    | 'teamsError'
    | 'selectedTeamId'
    | 'onTeamChange'
    | 'dateFrom'
    | 'dateTo'
    | 'onDateFromChange'
    | 'onDateToChange'
>) {
    return (
        <Card>
            <CardContent className="flex flex-col gap-4 pt-6">
                <SectionState isLoading={teamsLoading} error={teamsError} skeleton={<SelectSkeleton />}>
                    <div className="flex flex-wrap items-end gap-4">
                        {teams.length > 0 && (
                            <div className="flex flex-col gap-1">
                                <label htmlFor="analytics-team" className="text-xs font-medium text-muted-foreground">
                                    Team
                                </label>
                                <select
                                    id="analytics-team"
                                    value={selectedTeamId ?? ''}
                                    onChange={(event) => onTeamChange(Number(event.target.value))}
                                    className="h-9 min-w-[180px] rounded-lg border border-border bg-background px-3 text-sm"
                                >
                                    {teams.map((team) => (
                                        <option key={team.id} value={team.id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <AnalyticsDateRangeFilter
                            dateFrom={dateFrom}
                            dateTo={dateTo}
                            onDateFromChange={onDateFromChange}
                            onDateToChange={onDateToChange}
                        />
                    </div>
                </SectionState>
            </CardContent>
        </Card>
    );
}

export function AnalyticsDashboard({
    teamId,
    teams,
    teamsLoading,
    teamsError,
    selectedTeamId,
    onTeamChange,
    dateFrom,
    dateTo,
    onDateFromChange,
    onDateToChange,
    exportOpen,
    onExportOpen,
    onExportClose,
}: AnalyticsDashboardProps) {
    const optionalDateFrom = toOptionalDate(dateFrom);
    const optionalDateTo = toOptionalDate(dateTo);
    const enabled = teamId !== null;

    const { summary, isLoading: summaryLoading, error: summaryError } = useTaskSummary(
        teamId,
        enabled,
        optionalDateFrom,
        optionalDateTo,
    );
    const {
        productivity,
        isLoading: productivityLoading,
        error: productivityError,
    } = useTeamProductivity(teamId, enabled, optionalDateFrom, optionalDateTo);
    const {
        deadlines,
        isLoading: deadlinesLoading,
        error: deadlinesError,
    } = useUpcomingDeadlines(teamId, enabled);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                        <BarChart3 className="size-6 text-muted-foreground" />
                        Analytics & reporting
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Task completion metrics, team productivity, and upcoming deadlines.
                    </p>
                </div>
                <Button type="button" onClick={onExportOpen} disabled={!teamId}>
                    <Download className="size-4" />
                    Export tasks
                </Button>
            </div>

            <TeamFilterBar
                teams={teams}
                teamsLoading={teamsLoading}
                teamsError={teamsError}
                selectedTeamId={selectedTeamId}
                onTeamChange={onTeamChange}
                dateFrom={dateFrom}
                dateTo={dateTo}
                onDateFromChange={onDateFromChange}
                onDateToChange={onDateToChange}
            />

            {!teamId && !teamsLoading && !teamsError && (
                <p className="text-sm text-muted-foreground">Select a team to view analytics.</p>
            )}

            <AnalyticsOverviewSection
                summary={summary}
                productivity={productivity}
                summaryLoading={summaryLoading}
                summaryError={summaryError}
                productivityLoading={productivityLoading}
                productivityError={productivityError}
            />

            <AnalyticsProductivitySection
                productivity={productivity}
                isLoading={productivityLoading}
                error={productivityError}
            />

            <UpcomingDeadlinesPanel
                deadlines={deadlines}
                isLoading={deadlinesLoading}
                error={deadlinesError}
            />

            <ExportTasksDialog open={exportOpen} teamId={teamId} onClose={onExportClose} />
        </div>
    );
}
