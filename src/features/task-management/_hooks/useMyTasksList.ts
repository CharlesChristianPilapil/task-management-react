import { useCallback, useState } from 'react';

import type { PaginationMeta } from '@/features/shared/types';
import { getApiErrorMessage } from '@/features/shared/utils/get-api-error-message';

import { useMyTasksQuery } from '../_service';

const DEFAULT_PER_PAGE = 5;

const defaultPagination: PaginationMeta = {
    current_page: 1,
    last_page: 1,
    per_page: DEFAULT_PER_PAGE,
    total: 0,
};

export function useMyTasksList() {
    const [page, setPage] = useState(1);

    const { data, isLoading, isFetching, error } = useMyTasksQuery({
        page,
        per_page: DEFAULT_PER_PAGE,
    });

    const goToPage = useCallback((nextPage: number) => {
        setPage(nextPage);
    }, []);

    return {
        tasks: data?.tasks ?? [],
        pagination: data?.pagination ?? defaultPagination,
        isLoading,
        isFetching,
        error: error ? getApiErrorMessage(error, 'Failed to load your tasks.') : null,
        setPage: goToPage,
    };
}
