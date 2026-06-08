import axios, { type AxiosResponse } from 'axios';

import { getApiErrorMessage } from '@/features/shared/utils/get-api-error-message';

function getFilenameFromDisposition(disposition: string | undefined): string | null {
    if (!disposition) {
        return null;
    }

    const match = disposition.match(/filename="([^"]+)"/);
    return match?.[1] ?? null;
}

export function downloadBlobResponse(response: AxiosResponse<Blob>, fallbackFilename: string) {
    const filename =
        getFilenameFromDisposition(response.headers['content-disposition']) ?? fallbackFilename;
    const url = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

export async function getExportErrorMessage(error: unknown): Promise<string> {
    if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
        try {
            const text = await error.response.data.text();
            const parsed = JSON.parse(text) as { message?: string };
            if (parsed.message) {
                return parsed.message;
            }
        } catch {
            // Fall through to generic handler.
        }
    }

    return getApiErrorMessage(error, 'Failed to export tasks.');
}
