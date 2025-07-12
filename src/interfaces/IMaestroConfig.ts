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
        CRON?: {
            access_token: string
        }
    },
    tree: string[][],
    pathMaestro: string,
    created_at: string,
    updated_at: string
};