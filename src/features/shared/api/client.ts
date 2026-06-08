import axios from 'axios';
import { env } from '@/config/env';
import { storage } from '@/features/shared/utils/storage';

function createApiClient(baseURL: string) {
    const client = axios.create({
        baseURL,
        headers: { 'Content-Type': 'application/json' },
    });

    client.interceptors.request.use((config) => {
        const token = storage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    return client;
}

export const laravelClient = createApiClient(env.laravelApiUrl);
export const nodeClient = createApiClient(env.nodeApiUrl);
