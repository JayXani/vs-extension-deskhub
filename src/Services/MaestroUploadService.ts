import * as path from 'path';
import fs from 'fs';
import { apiDeskManager } from "../api/http-request";
import { MaestroNotChooseError } from "../Errors/MaestroNotChooseError";
import { MaestroRootEmptyError } from "../Errors/MaestroRootEmptyError";
import { messages } from "../utils/messages";
import { promptMaestro } from "../utils/prompts";
import { searchMaestroInFolder } from "../utils/searchMaestroInFolder";
import { showMessage } from "../utils/showMessage";
import { MaestroConfigNotFoundError } from "../Errors/MaestroConfigNotFoundError";
import { IMaestroConfig } from "../interfaces/IMaestroConfig";
import { IMaestroResponse } from "../interfaces/IMaestroRequests";
import { IDataRequest } from "../interfaces/IDataRequest";
import { decodeBase64 } from "../utils/decodeBase64";
import { IMaestroFile } from "../interfaces/IMaestroFile";
import { encodeBase64 } from "../utils/encondeBase64";
import { flowBuilder } from "../utils/flowBuilder";
import { MaestroFileChoose } from '../types/MaestroFileChoose';

export class MaestroUploadService {
    constructor(private vscode: boolean | any = false) { }
    async run(workspacePath: string) {
        try {
            showMessage("information", "Aguarde enquanto carregamos os maestros...", this.vscode);

            const maestroFileChoose: MaestroFileChoose = await this.getMaestroPath(workspacePath);
            const maestroFileConfig = this.loadMaestroConfig(maestroFileChoose);
            const tokenMaestro = await apiDeskManager("Login/autenticar", { PublicKey: maestroFileConfig.publicKey }, maestroFileConfig.apiKey);
            const maestroDownloaded = await this.downloadMaestroDM(maestroFileChoose, tokenMaestro);

            const maestroConfigJson: IMaestroFile = JSON.parse(maestroDownloaded.TMaestro.Fluxo);
            if (typeof maestroConfigJson.config === "string") { maestroConfigJson.config = JSON.parse(maestroConfigJson.config); }

            const maestroBuilded = this.builderMaestro(maestroConfigJson, maestroFileChoose, maestroDownloaded);
            const maestroUpdated = await apiDeskManager("Maestro", maestroBuilded, tokenMaestro, "application/json", "PUT");

            if ("erro" in maestroUpdated) { throw new Error(messages.errors.http_maestro_response_error.concat("Falha na requisição")); }

            return showMessage("information", "Sucesso ! Maestro atualizado no ambiente", this.vscode);
        } catch (e) {
            return showMessage("error", e.message, this.vscode);
        }
    }
    public async getMaestroPath(basePath: string) {
        const maestrosFound = searchMaestroInFolder("MAESTRO", basePath);
        if (!maestrosFound.success) { throw new Error(maestrosFound.message); }

        const maestroChoose = await promptMaestro(maestrosFound, this.vscode);
        if (!maestroChoose) { throw new MaestroNotChooseError(messages.errors.http_maestro_not_found); }

        const { key } = maestroChoose;
        const pathMaestro = maestrosFound.root.filter((v) => v.Path.includes(key));

        if (!pathMaestro.length) { throw new MaestroRootEmptyError("Não encontramos o caminho do arquivo do maestro :("); }
        return {
            path: pathMaestro[0].Path,
            key: key
        };
    }

    public loadMaestroConfig(maestro: MaestroFileChoose) {
        try {
            const maestroConfigPath = path.join(maestro.path, "maestro.config.json");
            if (!fs.existsSync(maestroConfigPath)) {
                throw new MaestroConfigNotFoundError(messages.errors.maestro_config_not_found);
            }
            const contentConfig = fs.readFileSync(maestroConfigPath, "utf-8");

            if (!contentConfig) { throw new MaestroConfigNotFoundError(messages.errors.maestro_config_not_found); }
            const contentConfigJSON = JSON.parse(contentConfig) as IMaestroConfig;
            return contentConfigJSON;

        } catch (e) {
            throw new Error("Falha no carregamento do maestro.config devido ao erro:" + e);
        }
    }

    public async downloadMaestroDM(maestroFile: MaestroFileChoose, token: string) {
        const bodyFind: IDataRequest = {
            url: "Maestro",
            authorizationToken: token,
            bodyDownload: { Chave: maestroFile.key }
        };
        const maestroResponse: IMaestroResponse = await apiDeskManager(bodyFind.url, bodyFind.bodyDownload, token);
        if (!maestroResponse.TMaestro) { throw new Error(messages.errors.http_maestro_not_found); }

        const flowDecoded = decodeBase64(maestroResponse.TMaestro.Fluxo);
        if (flowDecoded.error) { throw new Error(messages.errors.exception.concat("Levantamento de excessão durante a decodificação do base64.")); }
        maestroResponse.TMaestro.Fluxo = flowDecoded.data;

        return maestroResponse;
    }

    public builderMaestro(maestroConfig: IMaestroFile, maestroFileChoose: MaestroFileChoose, maestroDownloaded: IMaestroResponse) {
        // deep copy, para garantir que os objetos originais não sejam alterados
        const maestroConfigCopy = structuredClone(maestroConfig);
        const maestroDMCopy = structuredClone(maestroDownloaded);

        const flowBuilded = flowBuilder(maestroConfigCopy, maestroFileChoose.path);
        if (!flowBuilded.success) { throw new Error(flowBuilded.message); }

        maestroConfigCopy.config = flowBuilded.maestro.config;
        const fileEncoded = encodeBase64(JSON.stringify(maestroConfigCopy));
        if (fileEncoded.error) { throw new Error("Codificação para base64 resultou em falha!");} 

        maestroDMCopy.TMaestro.Fluxo = fileEncoded.data;
        return maestroDMCopy;
    }

}
