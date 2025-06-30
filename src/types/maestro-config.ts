export interface MaestroConfig {
    name: String,
    key: String,
    prefixo: String,
    author: String,
    url_post: String,
    url_get: String,
    memoria: {
        BEGIN_init: {},
        CRON: {
            access_token: String
        }
    },
    created_at: String,
    updated_at: String
};