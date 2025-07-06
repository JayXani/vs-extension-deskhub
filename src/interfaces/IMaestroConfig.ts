export interface IMaestroConfig {
    name: string,
    key: number,
    prefixo: string,
    author: string,
    urlPost: string,
    urlGet: string,
    token_email: string
    publicKey?: string,
    apiKey?: string,
    memoria: {
        BEGIN_init: {},
        CRON?: {
            access_token: string
        }
    },
    pathMaestro: string,
    created_at: string,
    updated_at: string
};