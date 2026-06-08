import { useMemo } from 'react';

import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/ui/pagination';
import type { PaginationMeta } from '@/features/shared/types';

import type { Team } from '../_types';
import { createTeamTableColumns } from '../_utils/team-table-columns';

type TeamsTableProps = {
    teams: Team[];
    pagination: PaginationMeta;
    isLoading?: boolean;
    onPageChange: (page: number) => void;
};

export function TeamsTable({
    teams,
    pagination,
    isLoading,
    onPageChange,
}: TeamsTableProps) {
    const columns = useMemo(() => createTeamTableColumns(), []);

    return (
        <div className="flex flex-col gap-4">
            <DataTable
                columns={columns}
                data={teams}
                rowKey="id"
                emptyMessage="No teams found."
                isLoading={isLoading}
            />
            <Pagination
                pagination={pagination}
                onPageChange={onPageChange}
                isLoading={isLoading}
            />
        </div>
    );
}
