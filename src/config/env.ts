export const env = {
    laravelApiUrl: import.meta.env.VITE_LARAVEL_API_URL,
    nodeApiUrl: import.meta.env.VITE_NODE_API_URL,
    appName: import.meta.env.VITE_APP_NAME,
} as const;
