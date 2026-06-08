import { cn } from '@/lib/utils';

type CompletionRateBadgeProps = {
    rate: number;
    className?: string;
};

function getTone(rate: number) {
    if (rate >= 0.9) {
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
    }

    if (rate >= 0.75) {
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
    }

    return 'bg-red-500/10 text-red-700 dark:text-red-400';
}

export function CompletionRateBadge({ rate, className }: CompletionRateBadgeProps) {
    const percentage = Math.round(rate * 100);

    return (
        <span
            className={cn(
                'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                getTone(rate),
                className,
            )}
        >
            {percentage}%
        </span>
    );
}
