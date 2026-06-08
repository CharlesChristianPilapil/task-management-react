import { useEffect, useState } from 'react';

import { analyticsService } from '../_service';
import type { UpcomingDeadlines } from '../_types';
import { getAnalyticsErrorMessage } from '../_utils/get-analytics-error';

export function useUpcomingDeadlines(teamId: number | null, enabled = true) {
    const [deadlines, setDeadlines] = useState<UpcomingDeadlines | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!teamId || !enabled) {
            setDeadlines(null);
            setError(null);
            return;
        }

        let cancelled = false;

        const fetchDeadlines = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await analyticsService.upcomingDeadlines(teamId);
                if (!cancelled) {
                    setDeadlines(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(getAnalyticsErrorMessage(err));
                    setDeadlines(null);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchDeadlines();

        return () => {
            cancelled = true;
        };
    }, [teamId, enabled]);

    return { deadlines, isLoading, error };
}
