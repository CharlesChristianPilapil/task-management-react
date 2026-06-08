import { getApiErrorMessage } from '@/features/shared/utils/get-api-error-message';

import { useMyTasksQuery } from '../_service';

export function useMyTasks() {
    const { data, isLoading, isFetching, error } = useMyTasksQuery({ per_page: 100 });

    return {
        tasks: data?.tasks ?? [],
        isLoading: isLoading || isFetching,
        error: error ? getApiErrorMessage(error, 'Failed to load your tasks.') : null,
    };
}
