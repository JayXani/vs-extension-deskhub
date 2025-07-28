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
    files: Array<Object>,
    constants: any[],
    cron: any[],
    autoBuilded: boolean,
    pathMaestro: string,
    created_at: string,
    updated_at: string
};