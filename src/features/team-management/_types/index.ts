import type { User } from '@/features/auth';

export type Team = {
    id: number;
    name: string;
    created_by: number;
    creator?: Pick<User, 'id' | 'name' | 'email'>;
    members_count?: number;
    created_at: string;
    updated_at: string;
};

export type TeamListParams = {
    per_page?: number;
    page?: number;
};

export type TeamMember = {
    id: number;
    name: string;
    email: string;
    role: 'lead' | 'member';
    role_label?: string;
};

export type TeamListResult = {
    teams: Team[];
    pagination: import('@/features/shared/types').PaginationMeta;
};
