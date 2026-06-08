import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import type { StatusSlice } from '../../_utils/chart-data';
import { STATUS_SLICE_COLORS } from './chart-colors';
import { ChartLegend } from './ChartLegend';
import { ChartTooltip } from './ChartTooltip';

type TaskStatusDonutChartProps = {
    data: StatusSlice[];
};

export function TaskStatusDonutChart({ data }: TaskStatusDonutChartProps) {
    if (data.length === 0) {
        return (
            <p className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
                No task data for this period.
            </p>
        );
    }

    return (
        <div>
            <ChartLegend
                items={data.map((slice) => ({
                    label: `${slice.name} (${slice.value})`,
                    color: STATUS_SLICE_COLORS[slice.key],
                }))}
            />
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={82}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                    >
                        {data.map((slice) => (
                            <Cell key={slice.key} fill={STATUS_SLICE_COLORS[slice.key]} stroke="transparent" />
                        ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                </PieChart>
            </ResponsiveContainer>
            <p className="mt-1 text-center text-xs text-muted-foreground">
                Share of completed vs pending tasks
            </p>
        </div>
    );
}
