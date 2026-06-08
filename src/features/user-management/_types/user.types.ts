import type { User, UserRole } from '@/features/auth';

export type { User, UserRole };

export type CreateUserPayload = {
    name: string;
    email: string;
    password: string;
    role: UserRole;
};

export type UpdateUserPayload = Partial<CreateUserPayload> & {
    is_active?: boolean;
};

export type UserListParams = {
    per_page?: number;
    page?: number;
    role?: UserRole;
    status?: 'active' | 'inactive';
};

export type UserListResult = {
    users: User[];
    pagination: import('@/features/shared/types').PaginationMeta;
};
