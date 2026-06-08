import { getApiErrorMessage } from '@/features/shared/utils/get-api-error-message';

import { useTeamTasksQuery } from '../_service';

export function useTeamTasks(teamId: number | null) {
    const { data, isLoading, error } = useTeamTasksQuery(
        { teamId: teamId ?? 0, per_page: 100 },
        { skip: !teamId },
    );

    return {
        tasks: data?.tasks ?? [],
        isLoading,
        error: error ? getApiErrorMessage(error, 'Failed to load team tasks.') : null,
    };
}
