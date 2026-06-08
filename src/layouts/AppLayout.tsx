import { Link, Outlet } from 'react-router-dom';

import { env } from '@/config/env';
import { ROUTES } from '@/config/routes';

const AppLayout = () => {
    return (
        <div className="min-h-screen">
            <header className="border-b border-border px-6 py-4">
                <nav className="flex items-center gap-4">
                    <span className="font-semibold">{env.appName}</span>
                    <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
                    <Link to={ROUTES.TASKS}>Tasks</Link>
                    <Link to={ROUTES.TEAMS}>Teams</Link>
                    <Link to={ROUTES.USERS}>Users</Link>
                    <Link to={ROUTES.ANALYTICS}>Analytics</Link>
                    <Link to={ROUTES.SETTINGS}>Settings</Link>
                </nav>
            </header>
            <main className="p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
