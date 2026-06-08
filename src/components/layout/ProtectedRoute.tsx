import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/features/auth';

export function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <Outlet />;
}
