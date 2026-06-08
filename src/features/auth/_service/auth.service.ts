import { authApi } from '../_api';
import { storage } from '@/features/shared/utils';
import type { User } from '../_types';

export const authService = {
    async login(email: string, password: string) {
        const { data } = await authApi.login(email, password);
        const { user, token } = data.data;
        storage.setToken(token.access_token);
        return { user, token };
    },

    async register(name: string, email: string, password: string) {
        const { data } = await authApi.register(name, email, password);
        const { user, token } = data.data;
        storage.setToken(token.access_token);
        return { user, token };
    },

    async fetchCurrentUser(): Promise<User> {
        const { data } = await authApi.me();
        return data.data;
    },

    async logout() {
        try {
            await authApi.logout();
        } finally {
            storage.removeToken();
        }
    },
};
