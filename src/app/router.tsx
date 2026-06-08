import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout, ProtectedRoute } from '@/components/layout';
import { ROUTES } from '@/config/routes';
import { AnalyticsPage } from '@/features/analytics';
import { LoginPage, RegisterPage } from '@/features/auth';
import { DashboardPage } from '@/features/dashboard';
import { SettingsPage } from '@/features/settings';
import { TaskDetailPage, TasksListPage } from '@/features/task-management';
import { TeamsPage } from '@/features/team-management';
import { UsersPage } from '@/features/user-management';

export const router = createBrowserRouter([
    {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
    },
    {
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    { index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
                    { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
                    { path: ROUTES.TASKS, element: <TasksListPage /> },
                    { path: ROUTES.TASK_DETAIL, element: <TaskDetailPage /> },
                    { path: ROUTES.TEAMS, element: <TeamsPage /> },
                    { path: ROUTES.USERS, element: <UsersPage /> },
                    { path: ROUTES.ANALYTICS, element: <AnalyticsPage /> },
                    { path: ROUTES.SETTINGS, element: <SettingsPage /> },
                ],
            },
        ],
    },
]);
