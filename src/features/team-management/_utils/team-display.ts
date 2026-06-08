export function formatDateTime(value: string | null) {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
