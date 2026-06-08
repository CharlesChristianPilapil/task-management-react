import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from '@/config/routes';
import useAuth from '@/hooks/useAuth';

const AuthLayout = () => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Outlet />;
};

export default AuthLayout;
