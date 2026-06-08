import { Navigate, Route, Routes } from 'react-router-dom';

import { ROUTES } from '@/config/routes';
import AppLayout from '@/layouts/AppLayout';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedRoutes from '@/layouts/ProtectedRoutes';
import RootLayout from '@/layouts/RootLayout';

import {
    Analytics,
    Dashboard,
    Login,
    NotFound,
    Settings,
    TaskDetail,
    TasksList,
    Teams,
    Users,
} from './LazyPages';

const IndexRoute = () => {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route path="*" element={<NotFound />} />

                <Route element={<AuthLayout />}>
                    <Route path={ROUTES.LOGIN} element={<Login />} />
                </Route>

                <Route element={<ProtectedRoutes />}>
                    <Route element={<AppLayout />}>
                        <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
                        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                        <Route path={ROUTES.TASKS} element={<TasksList />} />
                        <Route path={ROUTES.TASK_DETAIL} element={<TaskDetail />} />
                        <Route path={ROUTES.TEAMS} element={<Teams />} />
                        <Route path={ROUTES.USERS} element={<Users />} />
                        <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
                        <Route path={ROUTES.SETTINGS} element={<Settings />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
};

export default IndexRoute;
