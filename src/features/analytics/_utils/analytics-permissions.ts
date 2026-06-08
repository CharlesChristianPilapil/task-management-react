import type { User } from '@/features/auth';

export function canAccessAnalytics(user: User | null | undefined) {
    return user?.role === 'admin' || user?.role === 'manager';
}
