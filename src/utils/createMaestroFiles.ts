import { IMaestroFile, IMaestroTree } from "../interfaces/IMaestroFile";
import { IMaestroResponse } from "../interfaces/IMaestroRequests";
import { decodeBase64 } from "./decodeBase64";
import * as path from 'path';
import * as fs from 'fs';
import { createContentJsonata } from "./createScriptToJsonata";
import { RequestsValidatorsController } from "../Controller/RequestsValidatorsController";
import { IPathValidation } from "../interfaces/IPathValidation";

export const createMaestroFiles = async (basePath: string, maestroResponse: IMaestroResponse) => {
    const validator = new RequestsValidatorsController();

    const stringConverted = decodeBase64(maestroResponse.TMaestro.Fluxo);
    if (stringConverted.error) {
        return {
            success: false,
            message: stringConverted.error,
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

    maestroConfig.forEach((cfg) => configMap.set(cfg.name, cfg));

    fs.mkdirSync(fullPathMain, { recursive: true });
    for (const pathTree of tree) {
        let currentPath = fullPathMain;
        for (const part of pathTree) {
            currentPath = path.join(currentPath, part);
            if (!fs.existsSync(currentPath)) { fs.mkdirSync(currentPath, { recursive: true }); }
            const config = configMap.get(part);

            if (config && !config._written) {
                config._written = true; //Garante que as pastas não sejam criadas duplicadas, garantindo unicidade
                if (config.jsonata) {
                    const content = config.jsonata;
                    if (!content.toLowerCase().startsWith("#python") && !content.toLowerCase().startsWith("<!doctype html>")) {
                        const scriptJS = createContentJsonata(content);
                        const filePath = path.join(currentPath, `${part}.js`);
                        fs.writeFileSync(filePath, scriptJS, { encoding: "utf-8" });
                        continue;
                    }
                    const extension = content.toLowerCase().startsWith("#python") ? "py" : content.startsWith("<!doctype html>") ? "html" : "json";
                    const filePath = path.join(currentPath, `${part}.${extension}`);
                    fs.writeFileSync(filePath, content, { encoding: "utf-8" });
                }
                if (config.statement && config.delay) {
                    const filePath = path.join(currentPath, `${part}.loop.json`);
                    fs.writeFileSync(filePath, JSON.stringify({
                        delay: config.delay,
                        statement: config.statement
                    }), { encoding: "utf-8" });
                    continue;
                }
                if (config.statement) {
                    const filePath = path.join(currentPath, `${part}.statement.json`);
                    fs.writeFileSync(filePath, JSON.stringify({
                        statement: config.statement
                    }), { encoding: "utf-8" });
                    continue;
                }
                if (config.return) {
                    const returnValue = config.return;
                    const filePath = path.join(currentPath, `${part}.return.json`);
                    fs.writeFileSync(filePath, JSON.stringify({
                        return: returnValue
                    }), { encoding: "utf-8" });
                }
                if (config.response_model) {
                    const filePath = path.join(currentPath, `${part}.responsemodel.json`);
                    fs.writeFileSync(filePath, JSON.stringify(config.response_model), { encoding: "utf-8" });
                }
                if (config.request) {
                    const filePath = path.join(currentPath, `${part}.http.json`);
                    fs.writeFileSync(filePath, JSON.stringify({
                        request: config.request
                    }), { encoding: "utf-8" });
                }
            }
        }
    }
    return {
        success: true,
        message: "Pastas criadas com sucesso",
        path: fullPathMain,
        tree: maestroJSON.tree
    };
};