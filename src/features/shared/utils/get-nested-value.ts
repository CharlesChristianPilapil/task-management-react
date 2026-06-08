export function getNestedValue<T extends object>(obj: T, key: string): unknown {
    return key.split('.').reduce<unknown>((acc, part) => {
        if (acc !== null && acc !== undefined && typeof acc === 'object' && part in acc) {
            return (acc as Record<string, unknown>)[part];
        }

        return undefined;
    }, obj);
}
