import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import type { MemberCompletedPoint } from '../../_utils/chart-data';
import { CHART_COLORS } from './chart-colors';
import { ChartLegend } from './ChartLegend';
import { ChartTooltip } from './ChartTooltip';

type MemberWorkloadChartProps = {
    data: MemberCompletedPoint[];
};

export function MemberWorkloadChart({ data }: MemberWorkloadChartProps) {
    if (data.length === 0) {
        return (
            <p className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
                No workload data for this period.
            </p>
        );
    }

    return (
        <div>
            <ChartLegend
                items={[
                    { label: 'Completed', color: CHART_COLORS.memberCompleted },
                    { label: 'Still open', color: CHART_COLORS.memberPending },
                ]}
            />
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar
                        dataKey="completed"
                        name="Completed"
                        stackId="workload"
                        fill={CHART_COLORS.memberCompleted}
                        radius={[0, 0, 0, 0]}
                    />
                    <Bar
                        dataKey="pending"
                        name="Still open"
                        stackId="workload"
                        fill={CHART_COLORS.memberPending}
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
            <p className="mt-1 text-center text-xs text-muted-foreground">
                Completed vs open tasks per member
            </p>
        </div>
    );
}
