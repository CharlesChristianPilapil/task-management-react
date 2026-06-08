import { Skeleton } from '@/components/ui/skeleton';

type ChartSkeletonProps = {
    height?: number;
};

export function ChartSkeleton({ height = 220 }: ChartSkeletonProps) {
    return (
        <div className="flex flex-col gap-3" style={{ minHeight: height }}>
            <div className="flex gap-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="flex-1 w-full rounded-lg" style={{ minHeight: height - 32 }} />
        </div>
    );
}
