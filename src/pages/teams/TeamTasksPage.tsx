import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/config/routes';
import { SectionState } from '@/features/dashboard';
import { getApiErrorMessage } from '@/features/shared/utils/get-api-error-message';
import { TaskFilters, TasksTable, useTasks, useTeamMembers } from '@/features/task-management';
import {
    AddTaskDialog,
    canAccessTeamManagement,
    canViewTeam,
    useGetTeamQuery,
} from '@/features/team-management';
import useAuth from '@/hooks/useAuth';

function TasksTableSkeleton() {
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

export function TeamTasksPage() {
    const { teamId: teamIdParam } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const teamId = Number(teamIdParam);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

    const { data: team, isLoading: teamLoading, isFetching: teamFetching, error: teamError } =
        useGetTeamQuery(teamId, { skip: !teamId });

    const members = team?.members ?? [];
    const canView = canViewTeam(user, team, members);
    const canManageTeams = canAccessTeamManagement(user);
    const canCreateTasks = user?.role === 'admin' || user?.role === 'manager';

    const {
        tasks,
        pagination,
        filters,
        isLoading: tasksLoading,
        isFetching: tasksFetching,
        error: tasksError,
        setPage,
        setFilters,
    } = useTasks(teamId);

    const { members: assigneeOptions } = useTeamMembers(teamId);

    const canFilterByAssignee = user?.role === 'admin' || user?.role === 'manager';
    const loadError =
        (teamError ? getApiErrorMessage(teamError, 'Failed to load team.') : null) ??
        tasksError;

    if (!teamId) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    if (!teamLoading && team && user?.role === 'team_member' && !canView) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {team ? `${team.name} tasks` : 'Team tasks'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Browse team tasks with filters for status, priority, and assignee.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {canCreateTasks && team && (
                        <Button type="button" onClick={() => setIsAddTaskOpen(true)}>
                            Add task
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        onClick={() =>
                            navigate(
                                canManageTeams
                                    ? ROUTES.TEAM_DETAIL.replace(':id', String(teamId))
                                    : ROUTES.DASHBOARD,
                            )
                        }
                    >
                        {canManageTeams ? 'Back to team' : 'Back to dashboard'}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Task list</CardTitle>
                    <CardDescription>
                        Filter by status, priority, or assignee. Results are paginated.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {teamId && (
                        <TaskFilters
                            filters={filters}
                            onFilterChange={setFilters}
                            assigneeOptions={assigneeOptions}
                            showAssigneeFilter={canFilterByAssignee}
                        />
                    )}

                    <SectionState
                        isLoading={teamLoading || tasksLoading}
                        error={loadError}
                        isEmpty={!teamLoading && !tasksLoading && !loadError && tasks.length === 0}
                        emptyMessage="No tasks match the selected filters."
                        skeleton={<TasksTableSkeleton />}
                    >
                        <TasksTable
                            tasks={tasks}
                            pagination={pagination}
                            isLoading={teamFetching || tasksFetching}
                            onPageChange={setPage}
                        />
                    </SectionState>
                </CardContent>
            </Card>

            {team && (
                <AddTaskDialog
                    open={isAddTaskOpen}
                    team={team}
                    members={members}
                    onClose={() => setIsAddTaskOpen(false)}
                />
            )}
        </div>
    );
}
