type ChartTooltipEntry = {
    color?: string;
    name?: string;
    value?: number | string;
    dataKey?: string | number;
};

type ChartTooltipProps = {
    active?: boolean;
    payload?: ChartTooltipEntry[];
    label?: string | number;
    valueSuffix?: string;
};

export function ChartTooltip({
    active,
    payload,
    label,
    valueSuffix = '',
}: ChartTooltipProps) {
    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
            {label && <p className="mb-1 font-medium text-popover-foreground">{label}</p>}
            <div className="flex flex-col gap-0.5">
                {payload.map((entry, index: number) => (
                    <div key={`${entry.name}-${index}`} className="flex items-center gap-2">
                        <span
                            className="inline-block size-2 rounded-sm"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-muted-foreground">{entry.name ?? entry.dataKey}:</span>
                        <span className="font-medium text-popover-foreground">
                            {typeof entry.value === 'number'
                                ? Number.isInteger(entry.value)
                                    ? entry.value
                                    : entry.value.toFixed(1)
                                : entry.value}
                            {entry.name === 'Completion rate' || entry.dataKey === 'completion_rate'
                                ? '%'
                                : valueSuffix}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
