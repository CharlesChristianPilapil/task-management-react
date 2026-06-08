import { useCallback, useState } from 'react';

import type { PaginationMeta } from '@/features/shared/types';
import { getApiErrorMessage } from '@/features/shared/utils/get-api-error-message';

import { useListTeamsQuery } from '../_service';

const DEFAULT_PER_PAGE = 10;

const defaultPagination: PaginationMeta = {
    current_page: 1,
    last_page: 1,
    per_page: DEFAULT_PER_PAGE,
    total: 0,
};

export function useTeamsList() {
    const [page, setPage] = useState(1);

    const { data, isLoading, isFetching, error } = useListTeamsQuery({
        page,
        per_page: DEFAULT_PER_PAGE,
    });

    const goToPage = useCallback((nextPage: number) => {
        setPage(nextPage);
    }, []);

    return {
        teams: data?.teams ?? [],
        pagination: data?.pagination ?? defaultPagination,
        isLoading,
        isFetching,
        error: error ? getApiErrorMessage(error, 'Failed to load teams.') : null,
        setPage: goToPage,
    };
}
