import { useMemo, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionState, TeamSelector } from '@/features/dashboard';
import { TaskFilters, TasksTable, useTasks, useTeamMembers } from '@/features/task-management';
import { useTeams } from '@/features/team-management';
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

export function TasksListPage() {
    const { user } = useAuth();
    const { teams, isLoading: teamsLoading, error: teamsError } = useTeams();
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

    const resolvedTeamId = useMemo(() => {
        if (selectedTeamId !== null && teams.some((team) => team.id === selectedTeamId)) {
            return selectedTeamId;
        }

        return teams[0]?.id ?? null;
    }, [teams, selectedTeamId]);

    const { 
        tasks, 
        pagination, 
        filters, 
        isLoading, 
        isFetching, 
        error, 
        setPage, 
        setFilters 
    } = useTasks(resolvedTeamId);
    
    const { members } = useTeamMembers(resolvedTeamId);

    const canFilterByAssignee = user?.role === 'admin' || user?.role === 'manager';

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
                <p className="text-sm text-muted-foreground">
                    Browse team tasks with filters for status, priority, and assignee.
                </p>
            </div>

            <TeamSelector
                teams={teams}
                isLoading={teamsLoading}
                error={teamsError}
                selectedTeamId={resolvedTeamId}
                onTeamChange={setSelectedTeamId}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Task list</CardTitle>
                    <CardDescription>
                        Filter by status, priority, or assignee. Results are paginated.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {resolvedTeamId && (
                        <TaskFilters
                            filters={filters}
                            onFilterChange={setFilters}
                            assigneeOptions={members}
                            showAssigneeFilter={canFilterByAssignee}
                        />
                    )}

                    <SectionState
                        isLoading={teamsLoading || isLoading}
                        error={teamsError ?? error}
                        isEmpty={!teamsLoading && !isLoading && !error && tasks.length === 0}
                        emptyMessage="No tasks match the selected filters."
                        skeleton={<TasksTableSkeleton />}
                    >
                        <TasksTable
                            tasks={tasks}
                            pagination={pagination}
                            isLoading={isFetching}
                            onPageChange={setPage}
                        />
                    </SectionState>
                </CardContent>
            </Card>
        </div>
    );
}
