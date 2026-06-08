import { getApiErrorMessage } from '@/features/shared/utils/get-api-error-message';

import { useListUsersQuery } from '../_service/user.service';

export function useUsers() {
    const { data, isLoading, error } = useListUsersQuery({ per_page: 100 });

    return {
        users: data?.users ?? [],
        isLoading,
        error: error ? getApiErrorMessage(error, 'Failed to load users.') : null,
    };
}
