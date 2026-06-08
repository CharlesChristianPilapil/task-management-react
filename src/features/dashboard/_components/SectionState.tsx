import type { ReactNode } from 'react';

type SectionStateProps = {
    isLoading: boolean;
    error: string | null;
    isEmpty?: boolean;
    emptyMessage?: string;
    skeleton?: ReactNode;
    children: ReactNode;
};

export function SectionState({
    isLoading,
    error,
    isEmpty = false,
    emptyMessage = 'No data available.',
    skeleton,
    children,
}: SectionStateProps) {
    if (isLoading) {
        return <>{skeleton}</>;
    }

    if (error) {
        return (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
            </div>
        );
    }

    if (isEmpty) {
        return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
    }

    return <>{children}</>;
}
