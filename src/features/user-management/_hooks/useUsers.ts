import { useEffect, useState } from 'react';

import { getApiErrorMessage } from '@/features/shared/utils/get-api-error-message';

import { userService } from '../_service';
import type { User } from '../_types';

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchUsers = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const { users: data } = await userService.list({ per_page: 100 });
                if (!cancelled) {
                    setUsers(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(getApiErrorMessage(err, 'Failed to load users.'));
                    setUsers([]);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchUsers();

        return () => {
            cancelled = true;
        };
    }, []);

    return { users, isLoading, error };
}
