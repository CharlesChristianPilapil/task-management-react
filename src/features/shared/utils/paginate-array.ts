import type { PaginationMeta } from '@/features/shared/types';

export function paginateArray<T>(items: T[], page: number, perPage: number) {
    const total = items.length;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const currentPage = Math.min(Math.max(page, 1), lastPage);
    const start = (currentPage - 1) * perPage;

    const pagination: PaginationMeta = {
        current_page: currentPage,
        last_page: lastPage,
        per_page: perPage,
        total,
    };

    return {
        data: items.slice(start, start + perPage),
        pagination,
    };
}
