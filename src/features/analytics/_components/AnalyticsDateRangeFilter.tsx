type AnalyticsDateRangeFilterProps = {
    dateFrom: string;
    dateTo: string;
    onDateFromChange: (value: string) => void;
    onDateToChange: (value: string) => void;
};

export function AnalyticsDateRangeFilter({
    dateFrom,
    dateTo,
    onDateFromChange,
    onDateToChange,
}: AnalyticsDateRangeFilterProps) {
    return (
        <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1">
                <label htmlFor="analytics-date-from" className="text-xs font-medium text-muted-foreground">
                    From
                </label>
                <input
                    id="analytics-date-from"
                    type="date"
                    value={dateFrom}
                    onChange={(event) => onDateFromChange(event.target.value)}
                    className="h-8 rounded-lg border border-border bg-background px-3 text-sm"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="analytics-date-to" className="text-xs font-medium text-muted-foreground">
                    To
                </label>
                <input
                    id="analytics-date-to"
                    type="date"
                    value={dateTo}
                    min={dateFrom || undefined}
                    onChange={(event) => onDateToChange(event.target.value)}
                    className="h-8 rounded-lg border border-border bg-background px-3 text-sm"
                />
            </div>
        </div>
    );
}
