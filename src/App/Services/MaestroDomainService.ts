import * as path from 'path';
import fs from 'fs';
import { messagesV2 } from "../../Shared/constants/messages-v2";
import { searchMaestroInFolder } from "../../Infra/maestro/searchMaestroInFolder";
import { IMaestroConfig } from "../../Domain/types/IMaestroConfig";
import { IMaestroList, IMaestroResponse } from "../../Domain/types/IMaestroRequests";
import { IDataList, IDataRequestKey } from "../../Domain/types/IDataRequest";
import { decodeBase64 } from "../../Shared/helpers/decodeBase64";
import { IMaestroFile, IMaestroTree } from "../../Domain/types/IMaestroFile";
import { encodeBase64 } from "../../Shared/helpers/encondeBase64";
import { flowBuilder } from "../../Infra/maestro/flowBuilder";
import { MaestroFileChoose } from '../../Domain/types/MaestroFileChoose';
import { apiDeskManager } from '../../Infra/api/http-request';
import { MaestroRootEmptyError } from '../../Domain/errors/MaestroRootEmptyError';
import { MaestroConfigNotFoundError } from '../../Domain/errors/MaestroConfigNotFoundError';
import { MaestroNotChooseError } from '../../Domain/errors/MaestroNotChooseError';
import { MaestroNotFoundError } from '../../Domain/errors/MaestroNotFoundError';
import { ErrorCodes } from '../../Shared/constants/ErrorCodes';
import { MaestroContentConfigError } from '../../Domain/errors/MaestroContentConfigError';
import { MaestroBase64Error } from '../../Domain/errors/MaestroBase64Error';
import { MaestroValidatorService } from './MaestroValidatorService';
import { IPrompts } from '../../Domain/types/IPrompts';
import { MaestroListError } from '../../Domain/errors/MaestroListError';
import { ExceptionGeneral } from '../../Domain/errors/ExceptionGeneral';


export abstract class MaestroDomainService {
    private controllerValidation: MaestroValidatorService;

    constructor(private vscode: any, private vscodePrompts: IPrompts) {
        this.vscode = vscode;
        this.controllerValidation = new MaestroValidatorService();
    }

    public getPrompts() { return this.vscodePrompts; }
    public getVscode() { return this.vscode; }
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
        const bodyFind: IDataRequestKey = {
            authorizationToken: token,
            body: {
                Chave: maestroFile.key
            }
        };
        const maestroResponse: IMaestroResponse = await apiDeskManager("Maestro", bodyFind.body, token);
        if (!maestroResponse.TMaestro) { throw new MaestroContentConfigError(messagesV2.errors[ErrorCodes.MAESTRO_CONFIG_CONTENT_ERROR]); }

        const flowDecoded = decodeBase64(maestroResponse.TMaestro.Fluxo as string);
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

    public async loadMaestroList(token: string, search?: string) {
        const bodyList: IDataList = {
            authorizationToken: token,
            body: {
                Pesquisa: search,
                Tudo: "true",
                Ativo: "1"
            }
        };
        const maestroList: IMaestroList = await apiDeskManager("Maestro/lista", bodyList.body, bodyList.authorizationToken);
        if ("erro" in maestroList) { throw new MaestroListError(messagesV2.errors[ErrorCodes.MAESTRO_LIST_ERROR]); }
        await this.controllerValidation.valid('maestrolist', maestroList);

        return maestroList;
    }
    public async loadMaestroChoose(maestroList: IMaestroList, token: string) {
        const bodyKey: IDataRequestKey = {
            authorizationToken: token,
            body: {
                Chave: ""
            }
        };
        const maestroChoose = await this.getPrompts().promptMaestro(maestroList);
        bodyKey.body.Chave = maestroChoose.key;
        const maestroChoice: IMaestroResponse = await apiDeskManager("Maestro", bodyKey.body, bodyKey.authorizationToken);
        await this.controllerValidation.valid("maestrotfile", maestroChoice);
        return maestroChoice;
    }

    public convertFlowMaestro(flow: string) {
        try {

            const maestroFlowJson = JSON.parse(flow) as IMaestroFile;

            // O flowBuilder irá pegar todo o conteúdo do maestro recebido via API, realizar o download alterar o conteúdo
            // do parse que corresponder com o que está localmente, portanto, as alterações do VSCode permanecerão
            // E o download só será realizado dos itens que estão no maestro.
            const tree = maestroFlowJson.tree.split(";").map((v) => v.split("."));
            if (typeof maestroFlowJson.config === "string") {
                maestroFlowJson.config = JSON.parse(maestroFlowJson.config);
            }
            const maestroConfig = maestroFlowJson.config as IMaestroTree[];
            return {
                config: maestroConfig,
                tree: tree,
            };
        } catch (e) {
            throw new ExceptionGeneral("Erro ao decodificar o arquivo JSON");
        }
    }
}