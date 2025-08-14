export interface IDataRequest {
    authorizationToken: string,
}
export interface IDataList extends IDataRequest {
    body: {
        Pesquisa: string,
        Tudo: string,
        Ativo: string
    }
}

export interface IDataRequestKey extends IDataRequest {
    body: {
        Chave: string
    }
}