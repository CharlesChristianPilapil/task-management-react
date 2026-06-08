import { useState } from 'react';
import { Navigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/config/routes';
import { SectionState } from '@/features/dashboard';
import {
    AddTeamDialog,
    TeamsTable,
    canAccessTeamManagement,
    useTeamsList,
} from '@/features/team-management';
import useAuth from '@/hooks/useAuth';

function TeamsTableSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full" />
                ))}
            </div>
            <div className="flex justify-between">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-48" />
            </div>
        </div>
    );
}

export function TeamsPage() {
    const { user } = useAuth();
    const canManageTeams = canAccessTeamManagement(user);
    const { teams, pagination, isLoading, isFetching, error, setPage } = useTeamsList();
    const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);

    if (!canManageTeams) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Teams</h1>
                    <p className="text-sm text-muted-foreground">
                        Browse teams. Results are paginated.
                    </p>
                </div>
                <Button type="button" onClick={() => setIsAddTeamOpen(true)}>
                    Add team
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Team list</CardTitle>
                    <CardDescription>
                        Use actions to view a team or its tasks.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SectionState
                        isLoading={isLoading}
                        error={error}
                        isEmpty={!isLoading && !error && teams.length === 0}
                        emptyMessage="No teams found."
                        skeleton={<TeamsTableSkeleton />}
                    >
                        <TeamsTable
                            teams={teams}
                            pagination={pagination}
                            isLoading={isFetching}
                            onPageChange={setPage}
                        />
                    </SectionState>
                </CardContent>
            </Card>

            <AddTeamDialog open={isAddTeamOpen} onClose={() => setIsAddTeamOpen(false)} />
        </div>
    );
}
