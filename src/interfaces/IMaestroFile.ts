export interface IMaestroFile {
    config: [IMaestroTree]
    tree: string,
    constants: [],
    cron: [] 
}
export interface IMaestroTree {
    name: string;
    _written?: boolean; // Esse atributo não é retornado pelo maestro, é usado somente para criar os arquivos e não duplicados
    response_model?: any;
    jsonata?: string;
    statement?: string;
    delay?: string,
    request?: {}
    return?: {
        msg: string,
        pass: boolean,
        token: string
    }
}