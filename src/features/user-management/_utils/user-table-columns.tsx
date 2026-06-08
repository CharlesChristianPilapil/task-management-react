import { Pencil, Power } from 'lucide-react';

import type { DataTableColumn } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import type { User } from '@/features/auth';

import { USER_ROLE_LABELS } from './user-filter-options';

type UserTableActions = {
    currentUserId?: number;
    canEdit: (user: User) => boolean;
    canToggleStatus: (user: User) => boolean;
    onEdit: (user: User) => void;
    onToggleStatus: (user: User) => void;
    togglingUserId?: number | null;
};

export function createUserTableColumns({
    currentUserId,
    canEdit,
    canToggleStatus,
    onEdit,
    onToggleStatus,
    togglingUserId = null,
}: UserTableActions): DataTableColumn<User>[] {
    return [
        {
            key: 'name',
            header: 'Name',
            className: 'min-w-[10rem] font-medium',
            render: (user) => (
                <span>
                    {user.name}
                    {user.id === currentUserId && (
                        <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                    )}
                </span>
            ),
        },
        {
            key: 'email',
            header: 'Email',
            className: 'min-w-[12rem]',
        },
        {
            key: 'role',
            header: 'Role',
            render: (user) => user.role_label ?? USER_ROLE_LABELS[user.role],
        },
        {
            key: 'is_active',
            header: 'Status',
            render: (user) => (
                <span
                    className={
                        user.is_active
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-muted-foreground'
                    }
                >
                    {user.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            headerClassName: 'text-right',
            className: 'text-right',
            render: (user) => {
                const editable = canEdit(user);
                const toggleable = canToggleStatus(user);
                const isToggling = togglingUserId === user.id;

                if (!editable && !toggleable) {
                    return <span className="text-sm text-muted-foreground">—</span>;
                }

                return (
                    <div className="flex items-center justify-end gap-1">
                        {editable && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Edit ${user.name}`}
                                onClick={() => onEdit(user)}
                            >
                                <Pencil className="size-3.5" />
                            </Button>
                        )}
                        {toggleable && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label={
                                    user.is_active
                                        ? `Deactivate ${user.name}`
                                        : `Activate ${user.name}`
                                }
                                disabled={isToggling}
                                onClick={() => onToggleStatus(user)}
                            >
                                <Power className={isToggling ? 'animate-pulse' : undefined} />
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];
}
