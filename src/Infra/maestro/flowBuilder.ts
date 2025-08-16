import { MaestroIdentifierPythonError } from '../../Domain/errors/MaestroIdentifierPythonError';
import { IMaestroFile } from '../../Domain/types/IMaestroFile';
import { ErrorCodes } from '../../Shared/constants/ErrorCodes';
import { messagesV2 } from '../../Shared/constants/messages-v2';
import { recursiveSearch } from '../../Shared/helpers/recursiveSearch';
import * as fs from 'fs';

export const flowBuilder = (maestro: IMaestroFile, pathMaestro: string) => {
    const responseMaestroBuilded = {
        success: true,
        maestro: Object.assign({}, maestro), // Clonando o objeto para acesso seguro
        message: "Sucesso ! Maestro configurado."
    };

    // Ao invés de alterarmos o file original, alteramos uma cópia
    for (const cfg of responseMaestroBuilded.maestro.config) {
        const nameParse = cfg.name.replace("PARSE_", "").trim();
        const pathParse = recursiveSearch(pathMaestro, nameParse, false);

        if (pathParse && pathParse.endsWith(".py")) {

            const parseName = pathParse.split(/[/\\]/).pop().trim().replace(".py", "");
            if (cfg.name.includes(parseName)) {

                const contentFile = fs.readFileSync(pathParse, "utf-8");
                if (!contentFile.startsWith("#python")) { throw new MaestroIdentifierPythonError(messagesV2.errors[ErrorCodes.MAESTRO_IDENTIFIER_PYTHON_ERROR]); }
                cfg.jsonata = contentFile;
            }
        }
    }

    return responseMaestroBuilded;
};
