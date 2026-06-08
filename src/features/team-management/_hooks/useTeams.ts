import { useEffect, useState } from 'react';

import { getApiErrorMessage } from '@/features/shared/utils/get-api-error-message';

import { teamService } from '../_service';
import type { Team } from '../_types';

export function useTeams() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchTeams = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const { teams: data } = await teamService.list({ per_page: 100 });
                if (!cancelled) {
                    setTeams(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(getApiErrorMessage(err, 'Failed to load teams.'));
                    setTeams([]);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchTeams();

        return () => {
            cancelled = true;
        };
    }, []);

    return { teams, isLoading, error };
}
