import { Skeleton } from '@/components/ui/skeleton';

export function StatCardsSkeleton() {
    return (
        <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-24 w-full rounded-xl" />
            ))}
        </div>
    );
}

export function TaskListSkeleton() {
    return (
        <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-lg" />
            ))}
        </div>
    );
}

export function StatsGridSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full rounded-lg" />
                ))}
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
        </div>
    );
}

export function AnalyticsGridSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-lg" />
            ))}
        </div>
    );
}

export function ProductivityTableSkeleton() {
    return (
        <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-full rounded-md" />
            {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-9 w-full rounded-md" />
            ))}
        </div>
    );
}

export function SelectSkeleton() {
    return <Skeleton className="h-8 w-40 rounded-lg" />;
}
