import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from '@/config/routes';
import { useAuthInit } from '@/features/auth';
import useAuth from '@/hooks/useAuth';

const AuthLayout = () => {
    const { isAuthenticated } = useAuth();
    const { isInitializing } = useAuthInit();

    if (isInitializing) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Outlet />;
};

export default AuthLayout;
