import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/ui/pagination';
import type { User } from '@/features/auth';
import type { PaginationMeta } from '@/features/shared/types';
import { getApiErrorMessage } from '@/features/shared/utils/get-api-error-message';

import { useToggleUserStatusMutation } from '../_service/user.service';
import { createUserTableColumns } from '../_utils/user-table-columns';

type UsersTableProps = {
    users: User[];
    pagination: PaginationMeta;
    isLoading?: boolean;
    currentUserId?: number;
    canEdit: (user: User) => boolean;
    canToggleStatus: (user: User) => boolean;
    onPageChange: (page: number) => void;
    onEdit: (user: User) => void;
};

export function UsersTable({
    users,
    pagination,
    isLoading,
    currentUserId,
    canEdit,
    canToggleStatus,
    onPageChange,
    onEdit,
}: UsersTableProps) {
    const [pendingUser, setPendingUser] = useState<User | null>(null);
    const [togglingUserId, setTogglingUserId] = useState<number | null>(null);
    const [toggleStatus, { isLoading: isToggling }] = useToggleUserStatusMutation();

    const pendingAction = pendingUser
        ? pendingUser.is_active
            ? 'deactivate'
            : 'activate'
        : null;

    const handleRequestToggleStatus = useCallback((user: User) => {
        setPendingUser(user);
    }, []);

    const handleCloseConfirm = useCallback((open: boolean) => {
        if (!open) {
            setPendingUser(null);
        }
    }, []);

    const handleConfirmToggleStatus = useCallback(async () => {
        if (!pendingUser || !pendingAction) {
            return;
        }

        setTogglingUserId(pendingUser.id);
        const toastId = toast.loading(
            `${pendingAction === 'activate' ? 'Activating' : 'Deactivating'} user...`,
        );

        try {
            await toggleStatus(pendingUser.id).unwrap();
            toast.success(`User ${pendingAction}d`, { id: toastId });
            setPendingUser(null);
        } catch (error) {
            toast.error(getApiErrorMessage(error, `Failed to ${pendingAction} user.`), { id: toastId });
        } finally {
            setTogglingUserId(null);
        }
    }, [pendingAction, pendingUser, toggleStatus]);

    const columns = useMemo(
        () =>
            createUserTableColumns({
                currentUserId,
                canEdit,
                canToggleStatus,
                onEdit,
                onToggleStatus: handleRequestToggleStatus,
                togglingUserId: isToggling ? togglingUserId : null,
            }),
        [
            canEdit,
            canToggleStatus,
            currentUserId,
            handleRequestToggleStatus,
            isToggling,
            onEdit,
            togglingUserId,
        ],
    );

    return (
        <div className="flex flex-col gap-4">
            <DataTable
                columns={columns}
                data={users}
                rowKey="id"
                emptyMessage="No users found."
                isLoading={isLoading}
            />
            <Pagination
                pagination={pagination}
                onPageChange={onPageChange}
                isLoading={isLoading}
            />

            <ConfirmDialog
                open={pendingUser !== null}
                onOpenChange={handleCloseConfirm}
                title={
                    pendingAction
                        ? `${pendingAction.charAt(0).toUpperCase()}${pendingAction.slice(1)} user`
                        : 'Confirm action'
                }
                description={
                    pendingUser && pendingAction
                        ? `Are you sure you want to ${pendingAction} ${pendingUser.name}?`
                        : ''
                }
                confirmLabel={
                    pendingAction
                        ? `${pendingAction.charAt(0).toUpperCase()}${pendingAction.slice(1)}`
                        : 'Confirm'
                }
                onConfirm={handleConfirmToggleStatus}
                isLoading={isToggling}
                destructive={pendingAction === 'deactivate'}
            />
        </div>
    );
}
