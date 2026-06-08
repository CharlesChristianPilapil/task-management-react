import type { User } from '@/features/auth';

import type { Team, TeamMember } from '../_types';

export function canAccessTeamManagement(user: User | null | undefined) {
    return user?.role === 'admin' || user?.role === 'manager';
}

export function canViewTeam(
    user: User | null | undefined,
    team: Team | undefined,
    members: TeamMember[] = [],
) {
    if (!user || !team) {
        return false;
    }

    if (user.role === 'admin') {
        return true;
    }

    return members.some((member) => member.id === user.id);
}

export function canManageTeamMembers(
    user: User | null | undefined,
    team: Team | undefined,
    members: TeamMember[] = [],
) {
    if (!user || !team) {
        return false;
    }

    if (user.role === 'admin') {
        return true;
    }

    if (user.role !== 'manager') {
        return false;
    }

    return members.some((member) => member.id === user.id);
}

export function canRemoveMember(team: Team, member: TeamMember) {
    return !(team.created_by === member.id && member.role === 'lead');
}
