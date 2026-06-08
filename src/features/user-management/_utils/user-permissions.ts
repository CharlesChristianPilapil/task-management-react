import type { User, UserRole } from '@/features/auth';

export function canAccessUserManagement(user: User | null | undefined) {
    return user?.role === 'admin' || user?.role === 'manager';
}

export function canCreateUserWithRole(actor: User | null | undefined, role: UserRole) {
    if (!canAccessUserManagement(actor)) {
        return false;
    }

    if (actor?.role === 'admin') {
        return true;
    }

    return role === 'team_member';
}

export function canEditUser(actor: User | null | undefined, target: User) {
    if (!canAccessUserManagement(actor)) {
        return false;
    }

    if (actor?.role === 'admin') {
        return true;
    }

    return target.role === 'team_member';
}

export function canToggleUserStatus(actor: User | null | undefined, target: User) {
    if (!canEditUser(actor, target)) {
        return false;
    }

    return actor?.id !== target.id;
}

export function getAssignableRoles(actor: User | null | undefined): UserRole[] {
    if (actor?.role === 'admin') {
        return ['admin', 'manager', 'team_member'];
    }

    if (actor?.role === 'manager') {
        return ['team_member'];
    }

    return [];
}
