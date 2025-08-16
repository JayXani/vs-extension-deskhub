
//Mensagens gerais do sistema
export const messagesV2 = {
    errors: {
        E00000: "\n{type} (código: {code}):\nOcorreu alguma excessão durante o processo.",
        E00001: "\n{type} (código: {code}):\nNão encontramos nenhum arquivo .json em: {path}",
        E00002: "\n{type} (código: {code}):\nNenhum maestro da listagem foi selecionado",
        E00003: "\n{type} (código: {code}):\nOcorreu um erro durante a busca pela listagem de maestros.",
        E00004: "\n{type} (código: {code}):\nNão encontramos nenhum maestro com as informações passadas ou não existem maestros.",
        E00005: "\n{type} (código: {code}):\nNão foi possível realizar o carregamento do arquivo maestro.config.",
        E00006: "\n{type} (código: {code}):\nOcorreu um erro durante a conversão/decodificação do base64.",
        E00007: "\n{type} (código: {code}):\nNão foi possível realizar o carregamento do TMaestro.",
        E00008: "\n{type} (código: {code}):\nA API de listagem retornou um erro inesperado, pedimos que tente novamente.",
        E00009: "\n{type} (código: {code}):\nO tipo do config do maestro não pode ser uma string.",
        E00010: "\n{type} (código: {code}):\nUse a flag --merge ou a opção Maestro: Merge, pois já existe uma pasta com o nome: ",
        E00011: "\n{type} (código: {code}):\nUma excessão foi levantada durante o mapeamento das pastas",
        E00012: "\n{type} (código: {code}):\nAs credenciais de acesso ao maestro não podem estar vazias.",
        E00013: "\n{type} (código: {code}):\nATENÇÃO ! Não foi possível realizar a atualização do nome no maestro, portanto, alteramos o nome original do arquivo. Valide suas credenciais do ambiente.",
        E00014: "\n{type} (código: {code}):\nNão foi possível realizar a atulização do maestro devido ao erro:",
        E00015: "\n{type} (código: {code}):\nO nome do parse deve conter somente letras, números e underlines (_).",
        E00016: "\n{type} (código: {code}):\nNão é possível realizar a alteração do nome, pois já existe um parse com o nome informado.",
        E00017: "\n{type} (código: {code}):\nA String informada não é um base64 válido.",
        E00018: "\n{type} (código: {code}):\nIdentificador python(#python), não encontrado no arquivo, adicione o identificador antes de realizar o upload !",
        E00019: "\n{type} (código: {code}):\nFalha durante a requisição para a API informada.",
    },
    success: {
        SUC001: "✅ Sucesso !\n\nMaestros encontrados.",
        SUC002: "✅ Sucesso !\n\nMaestro atualizado.",
        SUC003: "✅ Sucesso !\n\nDados para requisição validados.",
        SUC004: "✅ Sucesso !\n\nConfigurações realizadas.",
        SUC005: "✅ Sucesso !\n\nO nome do parse foi alterado.",
        SUC006: "✅ Sucesso !\n\nMerge cancelado.",
        SUC007: "✅ Sucesso !\n\nMerge realizado com sucesso."
    }
};