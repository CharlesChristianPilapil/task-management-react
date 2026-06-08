import type { UserRole } from '@/features/auth';

export const USER_ROLE_OPTIONS: { value: UserRole; label: string }[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'team_member', label: 'Team Member' },
];

export const USER_STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
] as const;

export const USER_ROLE_LABELS: Record<UserRole, string> = {
    admin: 'Admin',
    manager: 'Manager',
    team_member: 'Team Member',
};
