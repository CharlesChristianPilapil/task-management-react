import axios from 'axios';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { getApiErrorMessage } from './get-api-error-message';

type ApiErrorBody = {
    message?: string;
    errors?: Record<string, string[] | string>;
};

function getApiErrorBody(error: unknown): ApiErrorBody | null {
    if (typeof error === 'object' && error !== null && 'data' in error) {
        const data = (error as { data?: unknown }).data;
        if (data && typeof data === 'object') {
            return data as ApiErrorBody;
        }
    }

    if (axios.isAxiosError(error) && error.response?.data && typeof error.response.data === 'object') {
        return error.response.data as ApiErrorBody;
    }

    return null;
}

function getApiFieldErrors(error: unknown): Record<string, string> | null {
    const body = getApiErrorBody(error);
    if (!body?.errors || typeof body.errors !== 'object') {
        return null;
    }

    const fieldErrors: Record<string, string> = {};

    for (const [field, messages] of Object.entries(body.errors)) {
        if (Array.isArray(messages) && messages.length > 0) {
            fieldErrors[field] = messages[0];
            continue;
        }

        if (typeof messages === 'string' && messages.length > 0) {
            fieldErrors[field] = messages;
        }
    }

    return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
}

export function applyApiErrorsToForm<TFieldValues extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<TFieldValues>,
): boolean {
    const fieldErrors = getApiFieldErrors(error);
    if (!fieldErrors) {
        return false;
    }

    for (const [field, message] of Object.entries(fieldErrors)) {
        setError(field as Path<TFieldValues>, { type: 'server', message });
    }

    return true;
}

export function handleFormApiError<TFieldValues extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<TFieldValues>,
    fallback: string,
) {
    const appliedFieldErrors = applyApiErrorsToForm(error, setError);

    return {
        appliedFieldErrors,
        message: getApiErrorMessage(error, fallback),
    };
}
