import { IMaestroFile } from '../../Domain/types/IMaestroFile';
import { messages } from '../../Shared/constants/messages';
import { recursiveSearch } from '../../Shared/helpers/recursiveSearch';
import * as fs from 'fs';

export const flowBuilder = (maestro: IMaestroFile, pathMaestro: string) => {
    const responseMaestroBuilded = {
        success: true,
        maestro: Object.assign({}, maestro), // Clonando o objeto para acesso seguro
        message: "Sucesso ! Maestro configurado."
    };
    try {
        // Ao invés de alterarmos o file original, alteramos uma cópia
        for (const cfg of responseMaestroBuilded.maestro.config) {
            const nameParse = cfg.name.replace("PARSE_", "").trim();
            const pathParse = recursiveSearch(pathMaestro, nameParse, false);

            if (pathParse && pathParse.endsWith(".py")) {

                const parseName = pathParse.split(/[/\\]/).pop().trim().replace(".py", "");
                if (cfg.name.includes(parseName)) {

                    const contentFile = fs.readFileSync(pathParse, "utf-8");
                    if (!contentFile.startsWith("#python")) {
                        responseMaestroBuilded.success = false;
                        responseMaestroBuilded.message = "Identificador python(#python), não encontrado no arquivo, adicione o identificador antes de realizar o upload !";
                        return responseMaestroBuilded;
                    }
                    cfg.jsonata = contentFile;
                }
            }
        };

    } catch (e) {
        responseMaestroBuilded.success = false;
        responseMaestroBuilded.message = messages.errors.exception.concat(e);
    }
    return responseMaestroBuilded;
};
