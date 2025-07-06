export interface IMaestroFile {
    config: [
        {
            name: string,
            response_model?: any
            jsonata?: string,
            statement?: string,
            return: {
                msg: string,
                pass: boolean,
                token: string
            }
        }
    ]
    tree: string,
    constants: [],
    cron: [] 
}