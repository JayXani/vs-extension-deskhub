import * as os from 'os';
import * as path from 'path';
import { IMaestroConfig } from '../interfaces/IMaestroConfig';
import { IDataRequest } from '../interfaces/IDataRequest';
import { RequestsValidatorsController } from '../Controller/RequestsValidatorsController';
import { promptGetToken, promptMaestro } from '../utils/prompts';
import { saveMaestroConfig } from '../utils/maestroFileWritterConfig';
import { apiDeskManager } from '../api/http-request';
import { extractPrefixFromUrl } from '../utils/getPrefixo';
import { IMaestroResponse, IMaestroList } from '../interfaces/IMaestroRequests';
import { showMessage } from '../utils/showMessage';
import { createMaestroFilesPy } from '../utils/createMaestroFilesPy';

export class MaestroInitService {
    async run(workspacePath: string, vscode: any) {
        const validatorController = new RequestsValidatorsController();
        const token = await promptGetToken(vscode);

        const dataRequest: IDataRequest = {
            authorizationToken: token,
            url: "",
            bodyList: {
                Pesquisa: "",
                Tudo: "true",
                Ativo: "1"
            },
            bodyDownload: {
                Chave: ""
            }
        };
        const validation = await validatorController.valid("init", dataRequest);
        if (!validation.success) { return showMessage("warning", validation.message, vscode); }
        showMessage("information", "Aguarde enquanto realizamos a busca na lista de maestros...", vscode);

        const maestroList: IMaestroList = await apiDeskManager("Maestro/lista", dataRequest.bodyList, dataRequest.authorizationToken);
        const validationMaestroList = await validatorController.valid('maestrolist', maestroList);
        if (!validationMaestroList.success) { return showMessage("warning", validationMaestroList.message, vscode); }

        const maestroChoosed = await promptMaestro(maestroList, vscode);
        if (!maestroChoosed) { return showMessage("warning", "Nenhum maestro selecionado.", vscode); }

        showMessage("information", "Aguarde enquanto buscamos pelo seu maestro...", vscode);

        dataRequest.bodyDownload.Chave = maestroChoosed.key.toString();
        const maestroChoice: IMaestroResponse = await apiDeskManager("Maestro", dataRequest.bodyDownload, dataRequest.authorizationToken);
        const validationMaestroChoice = await validatorController.valid("maestrotfile", maestroChoice);

        if (!validationMaestroChoice.success) { return showMessage("warning", validationMaestroChoice.message, vscode); }

        const config: IMaestroConfig = {
            name: maestroChoosed.label,
            key: maestroChoosed.key,
            prefixo: extractPrefixFromUrl(maestroChoice.TMaestro.Token),
            author: os.hostname(),
            urlPost: maestroChoice.TMaestro.Token,
            urlGet: maestroChoice.TMaestro.TokenGet,
            token_email: maestroChoice.TMaestro.TokenEmail,
            publicKey: '',
            apiKey: '',
            memoria: {
                CRON: {
                    access_token: JSON.parse(token)
                }
            },
            pathMaestro: "",
            tree: [],
            constants: [],
            cron: [],
            autoBuilded: false,
            files: maestroChoice.TFiles.map((f) => f),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const filesCreated = await createMaestroFilesPy(workspacePath, maestroChoice);
        if (!filesCreated.success) { return showMessage("warning", filesCreated.message, vscode); }

        const configPath = path.join(filesCreated.path, 'maestro.config.json'); // Cria o arquivo dentro do próprio diretório do maestro.
        
        config.pathMaestro = filesCreated.path;
        config.tree = filesCreated.tree.split(";").map((t) => t.split("."));
        config.constants = filesCreated.constants;
        config.cron = filesCreated.cron;

        if (!saveMaestroConfig(configPath, config)) { return showMessage("warning", "O arquivo maestro.config.json já existe.", vscode); }
        showMessage("information", '✅ Arquivo maestro.config.json criado com sucesso!', vscode);
    }
}
