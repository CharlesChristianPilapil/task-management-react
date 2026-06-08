import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { storage } from '@/features/shared/utils';
import useAuth from '@/hooks/useAuth';
import { useMeQuery } from '../_service';
import { logout, setCredentials } from '@/slices/authSlice';
import type { AppDispatch } from '@/store';

export const useAuthInit = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useAuth();
    const hasToken = !!storage.getToken();
    const { data, isLoading, isFetching, isError } = useMeQuery(undefined, { skip: !hasToken });

    useEffect(() => {
        if (data) {
            dispatch(setCredentials(data));
        }
    }, [data, dispatch]);

    useEffect(() => {
        if (isError && hasToken) {
            storage.removeToken();
            dispatch(logout());
        }
    }, [dispatch, hasToken, isError]);

    const isInitializing = hasToken && !isAuthenticated && (isLoading || isFetching);

    return { isInitializing };
};
