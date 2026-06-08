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
    onAddTask: (team: Team) => void;
};

export function TeamsTable({
    teams,
    pagination,
    isLoading,
    onPageChange,
    onAddTask,
}: TeamsTableProps) {
    const columns = useMemo(() => createTeamTableColumns({ onAddTask }), [onAddTask]);

    return (
        <div className="flex flex-col gap-4">
            <DataTable
                columns={columns}
                data={teams}
                rowKey="id"
                emptyMessage="No teams found."
            />
            <Pagination
                pagination={pagination}
                onPageChange={onPageChange}
                isLoading={isLoading}
            />
        </div>
    );
}
