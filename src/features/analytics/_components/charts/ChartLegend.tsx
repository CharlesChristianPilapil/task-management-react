type LegendItem = {
    label: string;
    color: string;
};

type ChartLegendProps = {
    items: LegendItem[];
};

export function ChartLegend({ items }: ChartLegendProps) {
    return (
        <div className="mb-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            {items.map((item) => (
                <span key={item.label} className="inline-flex items-center gap-1.5">
                    <span
                        className="inline-block size-2.5 rounded-sm"
                        style={{ backgroundColor: item.color }}
                    />
                    {item.label}
                </span>
            ))}
        </div>
    );
}
