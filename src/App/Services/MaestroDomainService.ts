import * as path from 'path';
import fs from 'fs';
import { messagesV2 } from "../../Shared/constants/messages-v2";
import { searchMaestroInFolder } from "../../Infra/maestro/searchMaestroInFolder";
import { IMaestroConfig } from "../../Domain/types/IMaestroConfig";
import { IMaestroResponse } from "../../Domain/types/IMaestroRequests";
import { IDataRequest } from "../../Domain/types/IDataRequest";
import { decodeBase64 } from "../../Shared/helpers/decodeBase64";
import { IMaestroFile } from "../../Domain/types/IMaestroFile";
import { encodeBase64 } from "../../Shared/helpers/encondeBase64";
import { flowBuilder } from "../../Infra/maestro/flowBuilder";
import { MaestroFileChoose } from '../../Domain/types/MaestroFileChoose';
import { apiDeskManager } from '../../Infra/api/http-request';
import { VSCodePrompts } from '../../Infra/prompts/VSCodePrompts';
import { MaestroRootEmptyError } from '../../Domain/errors/MaestroRootEmptyError';
import { MaestroConfigNotFoundError } from '../../Domain/errors/MaestroConfigNotFoundError';
import { MaestroNotChooseError } from '../../Domain/errors/MaestroNotChooseError';
import { MaestroNotFoundError } from '../../Domain/errors/MaestroNotFoundError';
import { ErrorCodes } from '../../Domain/errors/ErrorCodes';
import { MaestroContentConfigError } from '../../Domain/errors/MaestroContentConfigError';
import { MaestroBase64Error } from '../../Domain/errors/MaestroBase64Error';


export class MaestroDomainService {
    private vscodePrompts: VSCodePrompts;
    private vscode: any;

    constructor(vscode: any) {
        this.vscode = vscode;
        this.vscodePrompts = new VSCodePrompts(this.vscode);
    }
    public getVscode(): any { return this.vscode; }
    public async getMaestroPath(basePath: string) {
        const maestrosFound = searchMaestroInFolder("MAESTRO", basePath);
        if (!maestrosFound.success) { throw new MaestroNotFoundError(messagesV2.errors[ErrorCodes.MAESTRO_NOT_FOUND_ERROR]); }

        const maestroChoose = await this.vscodePrompts.promptMaestro(maestrosFound);
        if (!maestroChoose) { throw new MaestroNotChooseError(messagesV2.errors[ErrorCodes.MAESTRO_NOT_CHOOSE_ERROR]); }

        const { key } = maestroChoose;
        const pathMaestro = maestrosFound.root.filter((v) => v.Path.includes(key));

        if (!pathMaestro.length) { throw new MaestroRootEmptyError(messagesV2.errors[ErrorCodes.MAESTRO_ROOT_EMPTY_ERROR]); }
        return {
            path: pathMaestro[0].Path,
            key: key
        };
    }

    public loadMaestroConfig(maestro: MaestroFileChoose) {
    
        const maestroConfigPath = path.join(maestro.path, "maestro.config.json");
        if (!fs.existsSync(maestroConfigPath)) {
            throw new MaestroConfigNotFoundError(messagesV2.errors[ErrorCodes.MAESTRO_CONFIG_NOT_FOUND_ERROR].replace("{path}", maestroConfigPath));
        }
        const contentConfig = fs.readFileSync(maestroConfigPath, "utf-8");

        if (!contentConfig) { throw new MaestroContentConfigError(messagesV2.errors[ErrorCodes.MAESTRO_CONFIG_CONTENT_ERROR]); }
        const contentConfigJSON = JSON.parse(contentConfig) as IMaestroConfig;
        return contentConfigJSON;
    }

    public async downloadMaestroDM(maestroFile: MaestroFileChoose, token: string) {
        const bodyFind: IDataRequest = {
            url: "Maestro",
            authorizationToken: token,
            bodyDownload: { Chave: maestroFile.key }
        };
        const maestroResponse: IMaestroResponse = await apiDeskManager(bodyFind.url, bodyFind.bodyDownload, token);
        if (!maestroResponse.TMaestro) { throw new MaestroContentConfigError(messagesV2.errors[ErrorCodes.MAESTRO_CONFIG_CONTENT_ERROR]); }

        const flowDecoded = decodeBase64(maestroResponse.TMaestro.Fluxo);
        if (flowDecoded.error) { throw new MaestroBase64Error(messagesV2.errors[ErrorCodes.MAESTRO_BASE64_ERROR]); }
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
        if (fileEncoded.error) { throw new MaestroBase64Error(messagesV2.errors[ErrorCodes.MAESTRO_BASE64_ERROR]); }

        maestroDMCopy.TMaestro.Fluxo = fileEncoded.data;
        return maestroDMCopy;
    }

}