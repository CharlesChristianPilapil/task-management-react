import { useCallback, useMemo, useState } from 'react';

import type { PaginationMeta } from '@/features/shared/types';
import { getApiErrorMessage } from '@/features/shared/utils/get-api-error-message';

import { useTeamTasksQuery } from '../_service';
import type { TaskListParams } from '../_types';

const DEFAULT_PER_PAGE = 10;

const defaultPagination: PaginationMeta = {
    current_page: 1,
    last_page: 1,
    per_page: DEFAULT_PER_PAGE,
    total: 0,
};

type TaskFilters = Pick<TaskListParams, 'status' | 'priority' | 'assigned_to'>;

export function useTasks(teamId: number | null) {
    const [page, setPage] = useState(1);
    const [filters, setFiltersState] = useState<TaskFilters>({});
    const [prevTeamId, setPrevTeamId] = useState(teamId);

    if (teamId !== prevTeamId) {
        setPrevTeamId(teamId);
        setPage(1);
        setFiltersState({});
    }

    const queryArgs = useMemo(
        () => ({
            teamId: teamId ?? 0,
            page,
            per_page: DEFAULT_PER_PAGE,
            ...filters,
        }),
        [teamId, page, filters],
    );

    const { data, isLoading, isFetching, error, refetch } = useTeamTasksQuery(queryArgs, {
        skip: !teamId,
    });

    const goToPage = useCallback((nextPage: number) => {
        setPage(nextPage);
    }, []);

    const setFilters = useCallback((nextFilters: Partial<TaskFilters>) => {
        setFiltersState((current) => {
            const updated: TaskFilters = { ...current };

            if ('status' in nextFilters) {
                if (nextFilters.status === undefined) {
                    delete updated.status;
                } else {
                    updated.status = nextFilters.status;
                }
            }

            if ('priority' in nextFilters) {
                if (nextFilters.priority === undefined) {
                    delete updated.priority;
                } else {
                    updated.priority = nextFilters.priority;
                }
            }

            if ('assigned_to' in nextFilters) {
                if (nextFilters.assigned_to === undefined) {
                    delete updated.assigned_to;
                } else {
                    updated.assigned_to = nextFilters.assigned_to;
                }
            }

            return updated;
        });
        setPage(1);
    }, []);

    return {
        tasks: data?.tasks ?? [],
        pagination: data?.pagination ?? defaultPagination,
        filters,
        isLoading,
        isFetching,
        error: error ? getApiErrorMessage(error, 'Failed to load tasks.') : null,
        setPage: goToPage,
        setFilters,
        refresh: refetch,
    };
}
