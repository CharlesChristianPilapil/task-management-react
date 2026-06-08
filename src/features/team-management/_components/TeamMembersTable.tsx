import { Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DataTable } from '@/components/ui/data-table';
import type { DataTableColumn } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { paginateArray } from '@/features/shared/utils/paginate-array';
import { getApiErrorMessage } from '@/features/shared/utils/get-api-error-message';

import { useRemoveTeamMemberMutation } from '../_service';
import type { Team, TeamMember } from '../_types';
import { canRemoveMember } from '../_utils/team-permissions';

const DEFAULT_PER_PAGE = 10;

type TeamMembersTableProps = {
    team: Team;
    members: TeamMember[];
    canManageMembers: boolean;
    removingUserId?: number | null;
    onRemoveStart?: (userId: number) => void;
    onRemoveEnd?: () => void;
    isLoading?: boolean;
};

export function TeamMembersTable({
    team,
    members,
    canManageMembers,
    removingUserId = null,
    onRemoveStart,
    onRemoveEnd,
    isLoading = false,
}: TeamMembersTableProps) {
    const [page, setPage] = useState(1);
    const [pendingMember, setPendingMember] = useState<TeamMember | null>(null);
    const [removeMember, { isLoading: isRemoving }] = useRemoveTeamMemberMutation();

    const { data: paginatedMembers, pagination } = useMemo(
        () => paginateArray(members, page, DEFAULT_PER_PAGE),
        [members, page],
    );

    const handleRequestRemove = useCallback((member: TeamMember) => {
        setPendingMember(member);
    }, []);

    const handleCloseConfirm = useCallback((open: boolean) => {
        if (!open) {
            setPendingMember(null);
        }
    }, []);

    const handleConfirmRemove = useCallback(async () => {
        if (!pendingMember) {
            return;
        }

        onRemoveStart?.(pendingMember.id);
        const toastId = toast.loading('Removing member...');

        try {
            await removeMember({ teamId: team.id, userId: pendingMember.id }).unwrap();
            toast.success('Member removed', { id: toastId });
            setPendingMember(null);
        } catch (error) {
            toast.error(getApiErrorMessage(error, 'Failed to remove member.'), { id: toastId });
        } finally {
            onRemoveEnd?.();
        }
    }, [onRemoveEnd, onRemoveStart, pendingMember, removeMember, team.id]);

    const columns = useMemo<DataTableColumn<TeamMember>[]>(() => {
        const baseColumns: DataTableColumn<TeamMember>[] = [
            {
                key: 'name',
                header: 'Name',
                className: 'font-medium',
            },
            {
                key: 'email',
                header: 'Email',
            },
            {
                key: 'role_label',
                header: 'Role',
                render: (member) => member.role_label ?? member.role,
            },
        ];

        if (!canManageMembers) {
            return baseColumns;
        }

        return [
            ...baseColumns,
            {
                key: 'actions',
                header: 'Actions',
                headerClassName: 'text-right',
                className: 'text-right',
                render: (member) => {
                    const removable = canRemoveMember(team, member);
                    const isBusy = isRemoving && removingUserId === member.id;

                    return (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Remove ${member.name}`}
                            disabled={!removable || isRemoving}
                            onClick={() => handleRequestRemove(member)}
                        >
                            <Trash2 className={isBusy ? 'animate-pulse' : undefined} />
                        </Button>
                    );
                },
            },
        ];
    }, [canManageMembers, handleRequestRemove, isRemoving, removingUserId, team]);

    return (
        <div className="flex flex-col gap-4">
            <DataTable
                columns={columns}
                data={paginatedMembers}
                rowKey="id"
                emptyMessage="No members found."
                isLoading={isLoading || isRemoving}
            />
            <Pagination
                pagination={pagination}
                onPageChange={setPage}
                isLoading={isLoading || isRemoving}
            />

            <ConfirmDialog
                open={pendingMember !== null}
                onOpenChange={handleCloseConfirm}
                title="Remove member"
                description={
                    pendingMember
                        ? `Are you sure you want to remove ${pendingMember.name} from ${team.name}?`
                        : ''
                }
                confirmLabel="Remove"
                onConfirm={handleConfirmRemove}
                isLoading={isRemoving}
                destructive
            />
        </div>
    );
}
