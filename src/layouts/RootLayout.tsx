import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { storage } from '@/features/shared/utils/storage';
import { useMeQuery } from '@/services/AuthService';
import { setCredentials } from '@/slices/authSlice';

import SuspenseLayout from './SuspenseLayout';

const RootLayout = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const hasToken = !!storage.getToken();
    const { data } = useMeQuery(undefined, { skip: !hasToken });

    useEffect(() => {
        if (data) {
            dispatch(setCredentials(data));
        }
    }, [data, dispatch]);

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [location]);

    return (
        <SuspenseLayout>
            <Outlet />
        </SuspenseLayout>
    );
};

export default RootLayout;
