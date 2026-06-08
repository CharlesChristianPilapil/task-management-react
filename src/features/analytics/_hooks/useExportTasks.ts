import { useCallback, useState } from 'react';

import { analyticsService } from '../_service';
import type { ExportTasksRequest } from '../_types';
import { downloadBlobResponse, getExportErrorMessage } from '../_utils/download-export';

const FALLBACK_FILENAMES: Record<ExportTasksRequest['format'], string> = {
    csv: 'tasks-export.csv',
    json: 'tasks-export.json',
    xlsx: 'tasks-export.xlsx',
};

export function useExportTasks() {
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const exportTasks = useCallback(async (payload: ExportTasksRequest) => {
        setIsExporting(true);
        setError(null);

        try {
            const response = await analyticsService.exportTasks(payload);
            downloadBlobResponse(response, FALLBACK_FILENAMES[payload.format]);
            return { success: true as const };
        } catch (err) {
            const message = await getExportErrorMessage(err);
            setError(message);
            return { success: false as const, message };
        } finally {
            setIsExporting(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return { exportTasks, isExporting, error, clearError };
}
