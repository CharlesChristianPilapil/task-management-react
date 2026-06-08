import type { UserListParams } from '../_types';
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from '../_utils/user-filter-options';

const selectClassName =
    'h-8 rounded-lg border border-border bg-background px-3 text-sm min-w-[9rem]';

type UserFiltersProps = {
    filters: Pick<UserListParams, 'role' | 'status'>;
    onFilterChange: (filters: Partial<UserListParams>) => void;
    showRoleFilter?: boolean;
};

export function UserFilters({
    filters,
    onFilterChange,
    showRoleFilter = true,
}: UserFiltersProps) {
    return (
        <div className="flex flex-wrap items-end gap-4">
            {showRoleFilter && (
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="user-role-filter" className="text-xs font-medium text-muted-foreground">
                        Role
                    </label>
                    <select
                        id="user-role-filter"
                        value={filters.role ?? ''}
                        onChange={(event) =>
                            onFilterChange({
                                role: event.target.value
                                    ? (event.target.value as UserListParams['role'])
                                    : undefined,
                            })
                        }
                        className={selectClassName}
                    >
                        <option value="">All roles</option>
                        {USER_ROLE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="flex flex-col gap-1.5">
                <label htmlFor="user-status-filter" className="text-xs font-medium text-muted-foreground">
                    Status
                </label>
                <select
                    id="user-status-filter"
                    value={filters.status ?? ''}
                    onChange={(event) =>
                        onFilterChange({
                            status: event.target.value
                                ? (event.target.value as UserListParams['status'])
                                : undefined,
                        })
                    }
                    className={selectClassName}
                >
                    <option value="">All statuses</option>
                    {USER_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
