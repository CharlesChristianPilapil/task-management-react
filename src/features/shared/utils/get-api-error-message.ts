import axios from 'axios';

type ApiErrorBody = {
    message?: string;
};

function getMessageFromData(data: unknown): string | undefined {
    if (data && typeof data === 'object' && 'message' in data) {
        const message = (data as ApiErrorBody).message;
        return typeof message === 'string' && message.length > 0 ? message : undefined;
    }

    return undefined;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
    if (!error) {
        return fallback;
    }

    if (typeof error === 'object' && error !== null && 'data' in error) {
        const message = getMessageFromData((error as { data?: unknown }).data);
        if (message) {
            return message;
        }
    }

    if (axios.isAxiosError(error)) {
        if (!error.response) {
            return fallback;
        }

        const message = getMessageFromData(error.response.data);
        if (message) {
            return message;
        }
    }

    return fallback;
}
