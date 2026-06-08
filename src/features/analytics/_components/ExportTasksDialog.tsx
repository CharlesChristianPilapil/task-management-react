import { Download, ShieldCheck } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { TASK_STATUS_OPTIONS } from '@/features/task-management';

import { useExportTasks } from '../_hooks/useExportTasks';
import type { ExportFormat } from '../_types';

type ExportTasksDialogProps = {
    open: boolean;
    teamId: number | null;
    onClose: () => void;
};

const FORMAT_OPTIONS: { value: ExportFormat; label: string }[] = [
    { value: 'csv', label: 'CSV' },
    { value: 'json', label: 'JSON' },
    { value: 'xlsx', label: 'Excel' },
];

export function ExportTasksDialog({ open, teamId, onClose }: ExportTasksDialogProps) {
    const { exportTasks, isExporting, error, clearError } = useExportTasks();
    const [format, setFormat] = useState<ExportFormat>('csv');
    const [status, setStatus] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const resetForm = useCallback(() => {
        setFormat('csv');
        setStatus('');
        setDateFrom('');
        setDateTo('');
        clearError();
    }, [clearError]);

    const handleClose = () => {
        if (isExporting) {
            return;
        }

        resetForm();
        onClose();
    };

    const handleExport = async () => {
        if (!teamId) {
            toast.error('Select a team before exporting.');
            return;
        }

        const filters: Record<string, string> = {};
        if (status) {
            filters.status = status;
        }
        if (dateFrom) {
            filters.date_from = dateFrom;
        }
        if (dateTo) {
            filters.date_to = dateTo;
        }

        const toastId = toast.loading('Preparing export...');
        const result = await exportTasks({
            team_id: teamId,
            format,
            filters: Object.keys(filters).length > 0 ? filters : undefined,
        });

        if (result.success) {
            toast.success('Export downloaded', { id: toastId });
            resetForm();
            onClose();
            return;
        }

        toast.error(result.message, { id: toastId });
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            title="Export tasks"
            description="Download team tasks in your preferred format."
            closeDisabled={isExporting}
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Format</span>
                    <div className="grid grid-cols-3 gap-2">
                        {FORMAT_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                disabled={isExporting}
                                onClick={() => setFormat(option.value)}
                                className={cn(
                                    'rounded-lg border px-3 py-2 text-sm transition-colors',
                                    format === option.value
                                        ? 'border-primary bg-primary/5 font-medium text-primary'
                                        : 'border-border bg-background text-muted-foreground hover:bg-muted/50',
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="export-status" className="text-sm font-medium">
                        Status filter
                    </label>
                    <select
                        id="export-status"
                        value={status}
                        disabled={isExporting}
                        onChange={(event) => setStatus(event.target.value)}
                        className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
                    >
                        <option value="">All statuses</option>
                        {TASK_STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="export-date-from" className="text-sm font-medium">
                            From
                        </label>
                        <input
                            id="export-date-from"
                            type="date"
                            value={dateFrom}
                            disabled={isExporting}
                            onChange={(event) => setDateFrom(event.target.value)}
                            className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="export-date-to" className="text-sm font-medium">
                            To
                        </label>
                        <input
                            id="export-date-to"
                            type="date"
                            value={dateTo}
                            min={dateFrom || undefined}
                            disabled={isExporting}
                            onChange={(event) => setDateTo(event.target.value)}
                            className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
                        />
                    </div>
                </div>

                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ShieldCheck className="size-3.5" />
                    Export will be logged for audit purposes
                </p>

                {error && (
                    <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                        {error}
                    </p>
                )}

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" disabled={isExporting} onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="button" disabled={isExporting || !teamId} onClick={handleExport}>
                        {isExporting ? (
                            'Generating...'
                        ) : (
                            <>
                                <Download className="size-4" />
                                Download {format.toUpperCase()}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
