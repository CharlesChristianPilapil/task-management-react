import { useCallback, useState } from 'react';

import type { PaginationMeta } from '@/features/shared/types';
import { getApiErrorMessage } from '@/features/shared/utils/get-api-error-message';

import { useListUsersQuery } from '../_service';
import type { UserListParams } from '../_types';

const DEFAULT_PER_PAGE = 10;

const defaultPagination: PaginationMeta = {
    current_page: 1,
    last_page: 1,
    per_page: DEFAULT_PER_PAGE,
    total: 0,
};

export function useUsersList() {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<Pick<UserListParams, 'role' | 'status'>>({});

    const { data, isLoading, isFetching, error } = useListUsersQuery({
        page,
        per_page: DEFAULT_PER_PAGE,
        ...filters,
    });

    const goToPage = useCallback((nextPage: number) => {
        setPage(nextPage);
    }, []);

    const updateFilters = useCallback((nextFilters: Partial<UserListParams>) => {
        setFilters((current) => ({ ...current, ...nextFilters }));
        setPage(1);
    }, []);

    return {
        users: data?.users ?? [],
        pagination: data?.pagination ?? defaultPagination,
        filters,
        isLoading,
        isFetching,
        error: error ? getApiErrorMessage(error, 'Failed to load users.') : null,
        setPage: goToPage,
        setFilters: updateFilters,
    };
}
