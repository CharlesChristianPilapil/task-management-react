export const CHART_COLORS = {
    completed: 'var(--color-emerald-600, #059669)',
    pending: 'var(--color-amber-500, #f59e0b)',
    taskCount: 'var(--color-blue-500, #3b82f6)',
    completionRate: 'var(--color-teal-600, #0d9488)',
    memberCompleted: 'var(--color-violet-500, #8b5cf6)',
    memberPending: 'var(--color-orange-400, #fb923c)',
    grid: 'color-mix(in oklch, var(--foreground) 12%, transparent)',
    tooltipBorder: 'var(--border)',
    tooltipBg: 'var(--popover)',
    tooltipText: 'var(--popover-foreground)',
} as const;

export const STATUS_SLICE_COLORS: Record<'completed' | 'pending', string> = {
    completed: CHART_COLORS.completed,
    pending: CHART_COLORS.pending,
};
