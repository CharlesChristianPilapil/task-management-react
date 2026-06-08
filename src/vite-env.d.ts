/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_LARAVEL_API_URL: string;
    readonly VITE_NODE_API_URL: string;
    readonly VITE_APP_NAME: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
