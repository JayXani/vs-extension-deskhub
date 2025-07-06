import { IMaestroFile } from "../interfaces/IMaestroFile";
import { IMaestroResponse } from "../interfaces/IMaestroRequests";
import { convertBase64 } from "./convertBase64";
import * as path from 'path';
import * as fs from 'fs';

export const createMaestroFiles = (basePath: string, maestroResponse: IMaestroResponse) => {
    const stringConverted = convertBase64(maestroResponse.TMaestro.Fluxo);
    if (stringConverted.error) {
        return {
            error: stringConverted.error
        };
    }

    const maestroJSON: IMaestroFile = JSON.parse(stringConverted.data);
    const maestroConfig = maestroJSON.config;
    const fullPathMain = path.join(basePath, `Maestro: ${maestroResponse.TMaestro.Chave} - ${maestroResponse.TMaestro.Nome}`);
    if (fs.existsSync(fullPathMain)) { return {errpr: "Maestro já configurado no ambiente"}; }


    const folderMain = fs.mkdirSync(fullPathMain, { recursive: true });
    for (const index in Object.entries(maestroConfig)) {
        const config = maestroConfig[index];
        const fileName = config.name.toLowerCase().trim();
        if (fileName === "begin_init") {
            const beginInitPath = path.join(folderMain, "BEGIN_init.json");
            fs.writeFileSync(beginInitPath, JSON.stringify(config.response_model, null, 2), { encoding: "utf-8" });
        }
        if (fileName.includes("parse_")) { // DAR Continuidade a lógica

            const typeFile = config.jsonata.toLowerCase().startsWith("#python") ? "py" : config.jsonata.startsWith("<!doctype html>") ? "html" : "txt";
            const folderFile = fs.mkdirSync(path.join(folderMain, `${fileName}`), { recursive: true });
            const pathFile = path.join(folderFile, `${fileName}.${typeFile}`);
            const pathResponseModel = path.join(folderFile, `${fileName}.responsemodel.json`);
            fs.writeFileSync(pathFile, config.jsonata);
            fs.writeFileSync(pathResponseModel, JSON.stringify(config.response_model));
        }
    }
    return {
        success: "Arquivos criados com sucesso."
    };
};
