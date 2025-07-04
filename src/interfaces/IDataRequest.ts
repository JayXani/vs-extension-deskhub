export interface IDataRequest { 
    url: string, 
    authorizationToken: string,
    bodyDownload?: {
        Chave: string,
    }
    bodyUpload?: {
        Chave: string
        
    }
    bodyList?: {
        Pesquisa: string
    }
}