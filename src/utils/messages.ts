
//Mensagens gerais do sistema
export const messages = {
    errors: {
        exception: "FAIL: ",
        http_list_maestro_fail: "ATENÇÃO !Ocorreu um erro durante a busca pela listagem de maestros.",
        http_list_maestro_exception: "ATENÇÃO !\n\nUma excessão ocorreu durante o processo: ",
        http_url_cannot_be_empty: "ATENÇÃO !\n\nA URL informada não pode ser uma string vazia.",
        http_format_url_invalid: "ATENÇÃO !\n\nA URL informada não possui a formatação correta.",
        http_token_cannot_be_empty: "ATENÇÃO !\n\nCredencial não pode ser vazio.",
        http_maestro_not_found: "ATENÇÃO !\n\nNão encontramos nenhum maestro com as informações passadas, valide as credenciais.",
        http_maestro_response_error: "ERRO: ",
        string_is_not_base64: "ATENÇÃO! A String informada não é um base64.",
        folder_exists: "ATENÇÃO! Use a flag --merge ou a opção Maestro: Merge, pois já existe uma pasta com o nome: ",
        folder_exception: "ATENÇÃO! Uma excessão foi levantada durante a validação das pastas.",
        folder_not_found: "ATENÇÃO !\n\nNão encontramos nenhuma pasta com a chave correspondente",
        maestro_config_not_found: "ATENÇÃO !\n\nNão encontramos nenhum arquivo .json em:",
        maestro_config_not_loaded: "ERRO ! Não conseguimos realizar a leitura do arquivo JSON",
        maestro_config_array_invalid: "ATENÇÃO ! Não foi possível carregar o array da árvore do maestro",
        maestro_config_type: "ATENÇÃO ! O tipo do config do maestro não pode ser uma string.",
        maestro_name_rollback: "ATENÇÃO ! Não foi possível realizar a atualização do nome no maestro, portanto, alteramos o nome original do arquivo. Valide suas credenciais do ambiente.",
        name_not_is_valid: "ATENÇAO ! O nome do parse deve conter somente letras, números e underlines (_)."
    },
    success: {
        validation_request: "Sucesso !\n\nDados para requisição validados.",
        maestros_found: "Sucesso !\n\nMaestros encontrados.",
        file_name_update: "Sucesso ! O nome do parse foi alterado."
    }
};