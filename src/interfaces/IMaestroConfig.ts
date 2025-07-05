export interface IMaestroConfig {
    name: string,
    key: number,
    prefixo: string,
    author: string,
    url_post: string,
    url_get: string,
    publicKey?: string,
    apiKey?: string,
    memoria: {
        BEGIN_init: {},
        CRON?: {
            access_token: string
        }
    },
    created_at: string,
    updated_at: string
};