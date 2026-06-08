import { lazy, Suspense, type ReactNode } from 'react';

import { ChartSkeleton } from './ChartSkeleton';

export const LazyTaskStatusDonutChart = lazy(() =>
    import('./TaskStatusDonutChart').then((module) => ({
        default: module.TaskStatusDonutChart,
    })),
);

export const LazyMemberProductivityBarChart = lazy(() =>
    import('./MemberProductivityBarChart').then((module) => ({
        default: module.MemberProductivityBarChart,
    })),
);

export const LazyMemberWorkloadChart = lazy(() =>
    import('./MemberWorkloadChart').then((module) => ({
        default: module.MemberWorkloadChart,
    })),
);

type LazyChartProps = {
    children: ReactNode;
    height?: number;
};

export function LazyChart({ children, height = 220 }: LazyChartProps) {
    return <Suspense fallback={<ChartSkeleton height={height} />}>{children}</Suspense>;
}
