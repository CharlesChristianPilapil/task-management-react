import { useCallback, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/config/routes';
import { SectionState } from '@/features/dashboard';
import type { User } from '@/features/auth';
import {
    AddUserDialog,
    EditUserDialog,
    UserFilters,
    UsersTable,
    canAccessUserManagement,
    canEditUser,
    canToggleUserStatus,
    useUsersList,
} from '@/features/user-management';
import useAuth from '@/hooks/useAuth';

function UsersTableSkeleton() {
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

export function UsersPage() {
    const { user } = useAuth();
    const {
        users,
        pagination,
        filters,
        isLoading,
        isFetching,
        error,
        setPage,
        setFilters,
    } = useUsersList();
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const canManage = canAccessUserManagement(user);

    const handleEdit = useCallback((target: User) => {
        setEditingUser(target);
    }, []);

    const handleCloseEdit = useCallback(() => {
        setEditingUser(null);
    }, []);

    const checkCanEdit = useCallback(
        (target: User) => canEditUser(user, target),
        [user],
    );

    const checkCanToggleStatus = useCallback(
        (target: User) => canToggleUserStatus(user, target),
        [user],
    );

    if (!canManage) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage user accounts. Filter by role or status.
                    </p>
                </div>
                <Button type="button" onClick={() => setIsAddUserOpen(true)}>
                    Add user
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>User list</CardTitle>
                    <CardDescription>
                        Admins can manage all users. Managers can manage team members only.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <UserFilters
                        filters={filters}
                        onFilterChange={setFilters}
                        showRoleFilter={user?.role === 'admin'}
                    />

                    <SectionState
                        isLoading={isLoading}
                        error={error}
                        isEmpty={!isLoading && !error && users.length === 0}
                        emptyMessage="No users found."
                        skeleton={<UsersTableSkeleton />}
                    >
                        <UsersTable
                            users={users}
                            pagination={pagination}
                            isLoading={isFetching}
                            currentUserId={user?.id}
                            canEdit={checkCanEdit}
                            canToggleStatus={checkCanToggleStatus}
                            onPageChange={setPage}
                            onEdit={handleEdit}
                        />
                    </SectionState>
                </CardContent>
            </Card>

            <AddUserDialog
                open={isAddUserOpen}
                actor={user}
                onClose={() => setIsAddUserOpen(false)}
            />

            <EditUserDialog
                open={editingUser !== null}
                user={editingUser}
                actor={user}
                onClose={handleCloseEdit}
            />
        </div>
    );
}
