import { useEffect, useState } from 'react';

import { analyticsService } from '../_service';
import type { AnalyticsSummary } from '../_types';
import { getAnalyticsErrorMessage } from '../_utils/get-analytics-error';

export function useTaskSummary(teamId: number | null, enabled = true) {
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!teamId || !enabled) {
            setSummary(null);
            setError(null);
            return;
        }

        let cancelled = false;

        const fetchSummary = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await analyticsService.taskSummary(teamId);
                if (!cancelled) {
                    setSummary(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(getAnalyticsErrorMessage(err));
                    setSummary(null);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchSummary();

        return () => {
            cancelled = true;
        };
    }, [teamId, enabled]);

    return { summary, isLoading, error };
}
