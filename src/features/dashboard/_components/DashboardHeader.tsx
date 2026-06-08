import useAuth from '@/hooks/useAuth';

export function DashboardHeader() {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
                Welcome back, {user?.name ?? 'there'}. Here is an overview of your tasks and team
                activity.
            </p>
        </div>
    );
}
