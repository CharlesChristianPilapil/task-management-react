import { useEffect, useState } from 'react';

import { analyticsService } from '../_service';
import type { TeamProductivity } from '../_types';
import { getAnalyticsErrorMessage } from '../_utils/get-analytics-error';

export function useTeamProductivity(teamId: number | null, enabled = true) {
    const [productivity, setProductivity] = useState<TeamProductivity | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!teamId || !enabled) {
            setProductivity(null);
            setError(null);
            return;
        }

        let cancelled = false;

        const fetchProductivity = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await analyticsService.teamProductivity(teamId);
                if (!cancelled) {
                    setProductivity(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(getAnalyticsErrorMessage(err));
                    setProductivity(null);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchProductivity();

        return () => {
            cancelled = true;
        };
    }, [teamId, enabled]);

    return { productivity, isLoading, error };
}
