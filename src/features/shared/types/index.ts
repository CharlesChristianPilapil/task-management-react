export type ApiResponse<T> = {
    status: string;
    message: string;
    data: T;
    errors?: Record<string, string[]>;
};

export type PaginationMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

export type PaginatedData<TItem, TKey extends string> = Record<TKey, TItem[]> & {
    pagination: PaginationMeta;
};
