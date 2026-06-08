import { LogOut } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { env } from '@/config/env';
import { ROUTES } from '@/config/routes';
import { canAccessAnalytics } from '@/features/analytics';
import { useLogout } from '@/features/auth';
import { canAccessTeamManagement } from '@/features/team-management';
import { canAccessUserManagement } from '@/features/user-management';
import useAuth from '@/hooks/useAuth';

const AppLayout = () => {
    const { logout, isLoading } = useLogout();
    const { user } = useAuth();

    return (
        <div className="min-h-screen">
            <header className="border-b border-border px-6 py-4">
                <nav className="flex items-center justify-between gap-4 container mx-auto px-4">
                    <span className="font-semibold">
                        {env.appName}
                    </span>
                    <ul className="flex items-center gap-4">
                        <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
                        {canAccessTeamManagement(user) && <Link to={ROUTES.TEAMS}>Teams</Link>}
                        {canAccessUserManagement(user) && <Link to={ROUTES.USERS}>Users</Link>}
                        {canAccessAnalytics(user) && <Link to={ROUTES.ANALYTICS}>Analytics</Link>}
                        <Link to={ROUTES.SETTINGS}>Settings</Link>
                        <li>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={logout}
                                disabled={isLoading}
                            >
                                <LogOut />
                                Logout
                            </Button>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className="p-4 container mx-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
