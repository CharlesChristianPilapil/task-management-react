import { teamApi } from '../_api';
import type { Team } from '../_types';

export const teamService = {
    list: () => teamApi.list().then((res) => res.data.data),

    get: (teamId: number) => teamApi.get(teamId).then((res) => res.data.data),

    create: (payload: Pick<Team, 'name' | 'description'>) =>
        teamApi.create(payload).then((res) => res.data.data),

    addMember: (teamId: number, userId: number) =>
        teamApi.addMember(teamId, userId).then((res) => res.data.data),

    removeMember: (teamId: number, userId: number) =>
        teamApi.removeMember(teamId, userId).then((res) => res.data.data),
};
