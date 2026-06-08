import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { useAuthInit } from '@/features/auth';

import SuspenseLayout from './SuspenseLayout';

const RootLayout = () => {
    const location = useLocation();
    useAuthInit();

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [location]);

    return (
        <SuspenseLayout>
            <Toaster position="top-center" />
            <Outlet />
        </SuspenseLayout>
    );
};

export default RootLayout;
