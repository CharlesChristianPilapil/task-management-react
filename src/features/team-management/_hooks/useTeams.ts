import { getApiErrorMessage } from '@/features/shared/utils/get-api-error-message';
import useAuth from '@/hooks/useAuth';

import { useListTeamsQuery } from '../_service';
import { canAccessTeamManagement } from '../_utils/team-permissions';

export function useTeams() {
    const { user } = useAuth();
    const canListTeams = canAccessTeamManagement(user);

    const { data, isLoading, isFetching, error } = useListTeamsQuery(
        { per_page: 100 },
        { skip: !canListTeams },
    );

    return {
        teams: data?.teams ?? [],
        isLoading: canListTeams ? isLoading || isFetching : false,
        error: canListTeams && error ? getApiErrorMessage(error, 'Failed to load teams.') : null,
    };
}
