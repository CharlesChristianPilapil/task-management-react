import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import type { ProductivityChartPoint } from '../../_utils/chart-data';
import { CHART_COLORS } from './chart-colors';
import { ChartLegend } from './ChartLegend';
import { ChartTooltip } from './ChartTooltip';

type MemberProductivityBarChartProps = {
    data: ProductivityChartPoint[];
};

export function MemberProductivityBarChart({ data }: MemberProductivityBarChartProps) {
    if (data.length === 0) {
        return (
            <p className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
                No member productivity data available.
            </p>
        );
    }

    return (
        <div>
            <ChartLegend
                items={[
                    { label: 'Task count', color: CHART_COLORS.taskCount },
                    { label: 'Completion rate', color: CHART_COLORS.completionRate },
                ]}
            />
            <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar
                        dataKey="tasks"
                        name="Tasks"
                        fill={CHART_COLORS.taskCount}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={36}
                    />
                    <Bar
                        dataKey="completion_rate"
                        name="Completion rate"
                        fill={CHART_COLORS.completionRate}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={36}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
