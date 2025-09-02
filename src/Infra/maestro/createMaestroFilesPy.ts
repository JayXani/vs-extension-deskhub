import { IMaestroFile, IMaestroTree } from "../../Domain/types/IMaestroFile";
import { IMaestroResponse } from "../../Domain/types/IMaestroRequests";
import { decodeBase64 } from "../../Shared/helpers/decodeBase64";
import * as path from 'path';
import * as fs from 'fs';
import { MaestroValidatorService } from "../../App/Services/MaestroValidatorService";
import { IPathValidation } from "../../Domain/types/IPathValidation";
import { MaestroConfigNotIsJSONError } from "../../Domain/errors/MaestroConfigNotIsJSONError";
import { MaestroBase64Error } from "../../Domain/errors/MaestroBase64Error";
import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { messagesV2 } from "../../Shared/constants/messages-v2";

export const createMaestroFilesPy = async (basePath: string, maestroResponse: IMaestroResponse) => {
    const validator = new MaestroValidatorService();

    const stringConverted = decodeBase64(maestroResponse.TMaestro.Fluxo as string);
    if (stringConverted.error) {
        throw new MaestroBase64Error(messagesV2.errors[ErrorCodes.MAESTRO_BASE64_ERROR].concat(`- ${stringConverted.error}`));
    }
    let maestroJSON: IMaestroFile = null;
    try {
        maestroJSON = JSON.parse(stringConverted.data);
    } catch (e) {
        throw new MaestroConfigNotIsJSONError(messagesV2.errors[ErrorCodes.MAESTRO_CONFIG_CONTENT_ERROR]);
    }

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
    await validator.valid("folder_to_save", pathValidation); //Realiza toda a validação das pastas antes de realizar a criação do maestro
    if (typeof maestroConfig === "string") {
        throw new MaestroConfigNotIsJSONError(messagesV2.errors[ErrorCodes.MAESTRO_CONFIG_CONTENT_ERROR]);
    }
    maestroConfig.forEach((cfg) => configMap.set(cfg.name.replace("PARSE_", "").trim(), cfg));
    
    createFiles(fullPathMain, tree, configMap);
    return {
        success: true,
        message: "Pastas criadas com sucesso",
        constants: maestroJSON.constants,
        cron: maestroJSON.cron,
        path: fullPathMain
    };
};

export const createFiles = (basePath: string, tree: Array<string[]>, configMap: Map<string, IMaestroTree>) => {
    for (const pathTree of tree) {
        let currentPath = basePath;
        for (const part of pathTree) {
            const partReplaced = part.replace("PARSE_", "").trim();
            const config = configMap.get(partReplaced);
            if (config?.jsonata) {
                if (config && !config._written && config.jsonata.toLowerCase().startsWith("#python")) {
                    currentPath = path.join(currentPath, part);
                    if (!fs.existsSync(currentPath)) { fs.mkdirSync(currentPath, { recursive: true }); }

                    config._written = true; //Garante que as pastas não sejam criadas duplicadas, garantindo unicidade
                    if (config.jsonata) {
                        const content = config.jsonata;
                        const filePath = path.join(currentPath, `${part.replace("PARSE_", "").trim()}.py`);
                        if(fs.existsSync(filePath)){ continue; }
                        fs.writeFileSync(filePath, content, { encoding: "utf-8" });
                    }
                }
            }
        }
    }
};