import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/config/routes';
import { SectionState } from '@/features/dashboard';
import { getApiErrorMessage } from '@/features/shared/utils/get-api-error-message';
import {
    AddMemberDialog,
    TeamMembersTable,
    canAccessTeamManagement,
    canManageTeamMembers,
    canViewTeam,
    useGetTeamQuery,
} from '@/features/team-management';
import { formatDateTime } from '@/features/team-management/_utils/team-display';
import { useUsers } from '@/features/user-management';
import useAuth from '@/hooks/useAuth';

function TeamDetailSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
    );
}

export function TeamDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const teamId = Number(id);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [removingUserId, setRemovingUserId] = useState<number | null>(null);

    const { data: team, isLoading, isFetching, error } = useGetTeamQuery(teamId, {
        skip: !teamId,
    });
    const { users } = useUsers();

    const members = team?.members ?? [];
    const canView = canViewTeam(user, team, members);
    const canManageMembers = canManageTeamMembers(user, team, members);
    const canManageTeams = canAccessTeamManagement(user);
    const loadError = error ? getApiErrorMessage(error, 'Failed to load team.') : null;

    if (!isLoading && team && user?.role === 'team_member' && !canView) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Team detail</h1>
                    <p className="text-sm text-muted-foreground">
                        {canManageMembers
                            ? 'View team information and manage members.'
                            : 'View team information and members.'}
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => navigate(canManageTeams ? ROUTES.TEAMS : ROUTES.DASHBOARD)}
                >
                    {canManageTeams ? 'Back to teams' : 'Back to dashboard'}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{team?.name ?? 'Team'}</CardTitle>
                    <CardDescription>
                        {team?.creator
                            ? `Created by ${team.creator.name} on ${formatDateTime(team.created_at)}`
                            : 'Loading team details...'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <SectionState
                        isLoading={isLoading}
                        error={loadError}
                        isEmpty={!isLoading && !loadError && !team}
                        emptyMessage="Team not found."
                        skeleton={<TeamDetailSkeleton />}
                    >
                        {team && (
                            <>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="text-sm">
                                        <span className="text-muted-foreground">Members: </span>
                                        <span>{members.length || team.members_count || 0}</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-muted-foreground">Created: </span>
                                        <span>{formatDateTime(team.created_at)}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between gap-4">
                                        <h2 className="text-sm font-medium">Team members</h2>
                                        {canManageMembers && (
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => setIsAddMemberOpen(true)}
                                            >
                                                Add member
                                            </Button>
                                        )}
                                    </div>

                                    <TeamMembersTable
                                        team={team}
                                        members={members}
                                        canManageMembers={canManageMembers}
                                        removingUserId={removingUserId}
                                        onRemoveStart={setRemovingUserId}
                                        onRemoveEnd={() => setRemovingUserId(null)}
                                        isLoading={isFetching}
                                    />
                                </div>
                            </>
                        )}
                    </SectionState>
                </CardContent>
            </Card>

            {team && canManageMembers && (
                <AddMemberDialog
                    open={isAddMemberOpen}
                    team={team}
                    members={members}
                    users={users}
                    onClose={() => setIsAddMemberOpen(false)}
                />
            )}
        </div>
    );
}
