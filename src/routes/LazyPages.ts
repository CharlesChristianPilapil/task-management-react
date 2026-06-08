import { lazy } from 'react';

const Login = lazy(() =>
    import('@/pages/auth/LoginPage').then((module) => ({ default: module.LoginPage })),
);
const Dashboard = lazy(() =>
    import('@/pages/dashboard/DashboardPage').then((module) => ({
        default: module.DashboardPage,
    })),
);
const TasksList = lazy(() =>
    import('@/pages/tasks/TasksListPage').then((module) => ({ default: module.TasksListPage })),
);
const TaskDetail = lazy(() =>
    import('@/pages/tasks/TaskDetailPage').then((module) => ({
        default: module.TaskDetailPage,
    })),
);
const Teams = lazy(() =>
    import('@/pages/teams/TeamsPage').then((module) => ({ default: module.TeamsPage })),
);
const TeamDetail = lazy(() =>
    import('@/pages/teams/TeamDetailPage').then((module) => ({
        default: module.TeamDetailPage,
    })),
);
const Users = lazy(() =>
    import('@/pages/users/UsersPage').then((module) => ({ default: module.UsersPage })),
);
const Analytics = lazy(() =>
    import('@/pages/analytics/AnalyticsPage').then((module) => ({
        default: module.AnalyticsPage,
    })),
);
const Settings = lazy(() =>
    import('@/pages/settings/SettingsPage').then((module) => ({
        default: module.SettingsPage,
    })),
);
const NotFound = lazy(() => import('@/pages/ErrorPage'));

export {
    Analytics,
    Dashboard,
    Login,
    NotFound,
    Settings,
    TaskDetail,
    TasksList,
    TeamDetail,
    Teams,
    Users,
};
