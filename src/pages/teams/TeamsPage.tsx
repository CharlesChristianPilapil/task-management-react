import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionState } from '@/features/dashboard';
import {
    AddTaskDialog,
    AddTeamDialog,
    TeamsTable,
    useGetTeamQuery,
    useTeamsList,
    type Team,
} from '@/features/team-management';

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
    const { teams, pagination, isLoading, isFetching, error, setPage } = useTeamsList();
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);

    const { data: selectedTeamDetails } = useGetTeamQuery(selectedTeam?.id ?? 0, {
        skip: !selectedTeam,
    });

    const handleAddTask = useCallback((team: Team) => {
        setSelectedTeam(team);
    }, []);

    const handleCloseTaskDialog = useCallback(() => {
        setSelectedTeam(null);
    }, []);

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
                        Use actions to view a team or add a task.
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
                            onAddTask={handleAddTask}
                        />
                    </SectionState>
                </CardContent>
            </Card>

            <AddTeamDialog open={isAddTeamOpen} onClose={() => setIsAddTeamOpen(false)} />

            <AddTaskDialog
                open={selectedTeam !== null}
                team={selectedTeam}
                members={selectedTeamDetails?.members ?? []}
                onClose={handleCloseTaskDialog}
            />
        </div>
    );
}
