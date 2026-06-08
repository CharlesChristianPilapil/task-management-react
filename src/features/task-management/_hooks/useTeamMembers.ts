import { getApiErrorMessage } from '@/features/shared/utils/get-api-error-message';
import { useGetTeamQuery } from '@/features/team-management/_service';

export function useTeamMembers(teamId: number | null) {
    const { data, isLoading, isFetching, error } = useGetTeamQuery(teamId ?? 0, {
        skip: !teamId,
    });

    return {
        members: data?.members ?? [],
        isLoading: isLoading || isFetching,
        error: error ? getApiErrorMessage(error, 'Failed to load team members.') : null,
    };
}
