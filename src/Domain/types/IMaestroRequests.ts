import { IMaestroFile } from "./IMaestroFile";

export interface IMaestroList {
    root: [
        {
            Chave: number,
            Nome: string,
            Descricao: string,
            Publicado: string,
            URLIcone: string,
            valor: number
        }
    ],
    total?: string
}

export interface IMaestroResponse {
    TMaestro: {
        Chave: number,
        Nome: string,
        Descricao: string,
        Fluxo: Base64URLString,
        Token: string, //URL POST
        Publicado: string,
        Valor: number,
        TokenEmail: string,
        TokenGet: string
    },
    TFiles: [
        {
            Imagem: string
        }
    ]

}