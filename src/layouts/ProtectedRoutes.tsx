import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from '@/config/routes';
import useAuth from '@/hooks/useAuth';

const ProtectedRoutes = () => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};

export default ProtectedRoutes;
