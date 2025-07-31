import { IMaestroFile, IMaestroTree } from "../interfaces/IMaestroFile";
import { IMaestroResponse } from "../interfaces/IMaestroRequests";
import { decodeBase64 } from "./decodeBase64";
import * as path from 'path';
import * as fs from 'fs';
import { RequestsValidatorsController } from "../Controller/RequestsValidatorsController";
import { IPathValidation } from "../interfaces/IPathValidation";

export const createMaestroFilesPy = async (basePath: string, maestroResponse: IMaestroResponse) => {
    const validator = new RequestsValidatorsController();

    const stringConverted = decodeBase64(maestroResponse.TMaestro.Fluxo);
    if (stringConverted.error) {
        return {
            success: false,
            message: stringConverted.error,
            constants: [],
            cron: [],
            path: "",
            tree: ""
        };
    }
    const maestroJSON: IMaestroFile = JSON.parse(stringConverted.data);
    const maestroConfig = maestroJSON.config;
    const configMap = new Map<string, IMaestroTree>();
    const tree = maestroJSON.tree.split(";").map((t) => t.split("."));
    const maestroName = maestroResponse.TMaestro.Nome;
    const maestroKey = maestroResponse.TMaestro.Chave.toString();
    const fullPathMain = path.join(basePath, `Maestro - ${maestroKey} - ${maestroName}`);
    const pathValidation: IPathValidation = {
        basePath: basePath,
        fullPathMaestro: fullPathMain,
        keyMaestro: maestroKey
    };
    const foldersIsValid = await validator.valid("folder_to_save", pathValidation); //Realiza toda a validação das pastas antes de realizar a criação do maestro
    if (!foldersIsValid.success) {
        return {
            path: "",
            ...foldersIsValid
        };
    }

    maestroConfig.forEach((cfg) => configMap.set(cfg.name.replace("PARSE_", ""), cfg));

    fs.mkdirSync(fullPathMain, { recursive: true });
    for (const pathTree of tree) {
        let currentPath = fullPathMain;
        for (const part of pathTree) {
            const config = configMap.get(part);
            if(config?.jsonata){
                if (config && !config._written && config.jsonata.toLowerCase().startsWith("#python")) {
                    currentPath = path.join(currentPath, part);
                    if (!fs.existsSync(currentPath)) { fs.mkdirSync(currentPath, { recursive: true }); }
    
                    config._written = true; //Garante que as pastas não sejam criadas duplicadas, garantindo unicidade
                    if (config.jsonata) {
                        const content = config.jsonata;
                        const filePath = path.join(currentPath, `${part.replace("PARSE_", "")}.py`);
                        fs.writeFileSync(filePath, content, { encoding: "utf-8" });
                    }
                }
            }
        }
    }
    return {
        success: true,
        message: "Pastas criadas com sucesso",
        constants: maestroJSON.constants,
        cron: maestroJSON.cron,
        path: fullPathMain,
        tree: maestroJSON.tree
    };
};