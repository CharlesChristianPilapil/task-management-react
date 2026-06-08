import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { PaginationMeta } from '@/features/shared/types';
import { cn } from '@/lib/utils';

export type PaginationProps = {
    pagination: PaginationMeta;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
    className?: string;
};

function getPageRange(currentPage: number, lastPage: number): number[] {
    if (lastPage <= 7) {
        return Array.from({ length: lastPage }, (_, index) => index + 1);
    }

    const pages = new Set<number>([1, lastPage, currentPage]);

    for (let offset = -1; offset <= 1; offset += 1) {
        const page = currentPage + offset;
        if (page > 1 && page < lastPage) {
            pages.add(page);
        }
    }

    return Array.from(pages).sort((a, b) => a - b);
}

export function Pagination({
    pagination,
    onPageChange,
    isLoading = false,
    className,
}: PaginationProps) {
    const { current_page, last_page, per_page, total } = pagination;

    if (total === 0) {
        return null;
    }

    const start = (current_page - 1) * per_page + 1;
    const end = Math.min(current_page * per_page, total);
    const pages = getPageRange(current_page, last_page);

    return (
        <div
            className={cn(
                'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
                className,
            )}
        >
            <p className="text-sm text-muted-foreground">
                Showing {start}–{end} of {total}
            </p>

            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    aria-label="Previous page"
                    disabled={isLoading || current_page <= 1}
                    onClick={() => onPageChange(current_page - 1)}
                >
                    <ChevronLeft />
                </Button>

                {pages.map((page, index) => {
                    const previousPage = pages[index - 1];
                    const showEllipsis = previousPage !== undefined && page - previousPage > 1;

                    return (
                        <span key={page} className="flex items-center gap-1">
                            {showEllipsis && (
                                <span className="px-1 text-sm text-muted-foreground">…</span>
                            )}
                            <Button
                                type="button"
                                variant={page === current_page ? 'default' : 'outline'}
                                size="sm"
                                disabled={isLoading || page === current_page}
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </Button>
                        </span>
                    );
                })}

                <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    aria-label="Next page"
                    disabled={isLoading || current_page >= last_page}
                    onClick={() => onPageChange(current_page + 1)}
                >
                    <ChevronRight />
                </Button>
            </div>
        </div>
    );
}
