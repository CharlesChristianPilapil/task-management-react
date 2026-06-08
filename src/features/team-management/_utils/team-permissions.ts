import type { User } from '@/features/auth';

import type { Team, TeamMember } from '../_types';

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

    const membership = members.find((member) => member.id === user.id);

    if (!membership) {
        return false;
    }

    if (user.role === 'manager') {
        return true;
    }

    return membership.role === 'lead';
}

export function canRemoveMember(team: Team, member: TeamMember) {
    return !(team.created_by === member.id && member.role === 'lead');
}
