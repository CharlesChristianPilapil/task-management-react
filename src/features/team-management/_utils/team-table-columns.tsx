import { Eye, ListTodo } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { DataTableColumn } from '@/components/ui/data-table';
import { ROUTES, teamTasksPath } from '@/config/routes';

import type { Team } from '../_types';
import { formatDateTime } from './team-display';

export function createTeamTableColumns(): DataTableColumn<Team>[] {
    return [
        {
            key: 'name',
            header: 'Name',
            className: 'min-w-[12rem] font-medium',
        },
        {
            key: 'creator.name',
            header: 'Created by',
        },
        {
            key: 'members_count',
            header: 'Members',
            render: (team) => team.members_count ?? '—',
        },
        {
            key: 'created_at',
            header: 'Created',
            render: (team) => formatDateTime(team.created_at),
        },
        {
            key: 'actions',
            header: 'Actions',
            headerClassName: 'text-right',
            className: 'text-right',
            render: (team) => (
                <div className="flex items-center justify-end gap-1">
                    <Link
                        to={ROUTES.TEAM_DETAIL.replace(':id', String(team.id))}
                        aria-label={`View ${team.name}`}
                        className="inline-flex size-7 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
                    >
                        <Eye className="size-3.5" />
                    </Link>
                    <Link
                        to={teamTasksPath(team.id)}
                        aria-label={`View tasks for ${team.name}`}
                        className="inline-flex size-7 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
                    >
                        <ListTodo className="size-3.5" />
                    </Link>
                </div>
            ),
        },
    ];
}
