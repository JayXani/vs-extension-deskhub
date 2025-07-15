
//Mensagens gerais do sistema
export const messages = {
    errors: {
        http_list_maestro_fail: "ATENÇÃO !Ocorreu um erro durante a busca pela listagem de maestros.",
        http_list_maestro_exception: "ATENÇÃO !\n\nUma excessão ocorreu durante o processo: ",
        http_url_cannot_be_empty: "ATENÇÃO !\n\nA URL informada não pode ser uma string vazia.",
        http_format_url_invalid: "ATENÇÃO !\n\nA URL informada não possui a formatação correta.",
        http_token_cannot_be_empty: "ATENÇÃO !\n\nO token authorization não pode ser vazio.",
        http_maestro_not_found: "ATENÇÃO !\n\nNão encontramos nenhum maestro com as informações passadas.",
        http_maestro_response_error: "ERRO: ",
        string_is_not_base64: "ATENÇÃO! A String informada não é um base64.",
        folder_exists: "ATENÇÃO! Já existe uma pasta com: ",
        folder_exception: "ATENÇÃO! Uma excessão foi levantada durante a validação das pastas.",
        folder_not_found: "ATENÇÃO !\n\nNão encontramos nenhuma pasta com a chave correspondente"
    },
    success: {
        validation_request: "Sucesso !\n\nDados para requisição validados.",
        maestros_found: "Sucesso !\n\nMaestros encontrados.",
    }
};