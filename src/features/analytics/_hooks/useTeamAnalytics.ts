import { useEffect, useState } from 'react';

import { analyticsService } from '../_service';
import type { AnalyticsSummary, TeamProductivity } from '../_types';

export function useTeamAnalytics(teamId: number | null, enabled = true) {
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [productivity, setProductivity] = useState<TeamProductivity | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!teamId || !enabled) {
            setSummary(null);
            setProductivity(null);
            return;
        }

        let cancelled = false;

        const fetchAnalytics = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [summaryData, productivityData] = await Promise.all([
                    analyticsService.taskSummary(teamId),
                    analyticsService.teamProductivity(teamId),
                ]);

                if (!cancelled) {
                    setSummary(summaryData);
                    setProductivity(productivityData);
                }
            } catch {
                if (!cancelled) {
                    setError('Failed to load team analytics.');
                    setSummary(null);
                    setProductivity(null);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchAnalytics();

        return () => {
            cancelled = true;
        };
    }, [teamId, enabled]);

    return { summary, productivity, isLoading, error };
}
