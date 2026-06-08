export type ApiResponse<T> = {
    status: string;
    message: string;
    data: T;
    errors?: Record<string, string[]>;
};
