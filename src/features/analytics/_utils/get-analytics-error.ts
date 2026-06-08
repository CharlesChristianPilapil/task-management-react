import { getApiErrorMessage } from '@/features/shared/utils/get-api-error-message';

export function getAnalyticsErrorMessage(error: unknown): string {
    return getApiErrorMessage(error, 'Failed to load analytics data.');
}
