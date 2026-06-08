import type { AnalyticsSummary, MemberProductivity } from '../_types';

export type StatusSlice = {
    name: string;
    value: number;
    key: 'completed' | 'pending';
};

export type ProductivityChartPoint = {
    name: string;
    tasks: number;
    completed: number;
    completion_rate: number;
    avg_time: number | null;
};

export type MemberCompletedPoint = {
    name: string;
    completed: number;
    pending: number;
};

export function toStatusChartData(summary: AnalyticsSummary): StatusSlice[] {
    const slices: StatusSlice[] = [
        { name: 'Completed', value: summary.completed_tasks, key: 'completed' },
        { name: 'Pending', value: summary.pending_tasks, key: 'pending' },
    ];

    return slices.filter((slice) => slice.value > 0);
}

export function toProductivityChartData(members: MemberProductivity[]): ProductivityChartPoint[] {
    return members.map((member) => ({
        name: member.name.split(' ')[0] ?? member.name,
        tasks: member.task_count,
        completed: member.completed_count,
        completion_rate: Math.round(member.completion_rate * 100),
        avg_time: member.avg_completion_time,
    }));
}

export function toMemberCompletedChartData(members: MemberProductivity[]): MemberCompletedPoint[] {
    return members.map((member) => ({
        name: member.name.split(' ')[0] ?? member.name,
        completed: member.completed_count,
        pending: Math.max(member.task_count - member.completed_count, 0),
    }));
}

export function formatCompletionHours(hours: number | null) {
    if (hours === null) {
        return '—';
    }

    if (hours >= 24) {
        return `${(hours / 24).toFixed(1)}d`;
    }

    return `${hours.toFixed(1)}h`;
}

export function getCompletionPercentage(summary: AnalyticsSummary) {
    if (summary.total_tasks === 0) {
        return 0;
    }

    return Math.round((summary.completed_tasks / summary.total_tasks) * 100);
}
