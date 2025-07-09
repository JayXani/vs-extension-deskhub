import * as os from 'os';
import * as path from 'path';
import { IMaestroConfig } from '../interfaces/IMaestroConfig';
import { IDataRequest } from '../interfaces/IDataRequest';
import * as vscode from 'vscode';
import { RequestsValidatorsController } from '../Controller/RequestsValidatorsController';
import { promptGetToken, promptMaestro } from '../utils/prompts';
import { saveMaestroConfig } from '../utils/maestroFileWritterConfig';
import { apiDeskManager } from '../api/http-request';
import { extractPrefixFromUrl } from '../utils/getPrefixo';
import { IMaestroResponse, IMaestroList } from '../interfaces/IMaestroRequests';
import { createMaestroFiles } from '../utils/createMaestroFiles';

export class MaestroInitService {
    async run(workspacePath: string) {
        const validatorController = new RequestsValidatorsController();
        const token = await promptGetToken();

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
        if (!validation.success) {
            vscode.window.showWarningMessage(validation.message);
            return;
        }

        vscode.window.showInformationMessage("Aguarde enquanto realizamos a busca na lista de maestros...");

        const maestroList: IMaestroList = await apiDeskManager("Maestro/lista", dataRequest.bodyList, dataRequest.authorizationToken);
        const validationMaestroList = await validatorController.valid('maestrolist', maestroList);
        if (!validationMaestroList.success) {
            vscode.window.showWarningMessage(validationMaestroList.message);
            return;
        }

        const maestroChoosed = await promptMaestro(maestroList);
        if (!maestroChoosed) {
            vscode.window.showWarningMessage("Nenhum maestro selecionado.");
            return;
        }

        vscode.window.showInformationMessage("Aguarde enquanto buscamos pelo seu maestro...");

        dataRequest.bodyDownload.Chave = maestroChoosed.key.toString();
        const maestroChoice: IMaestroResponse = await apiDeskManager("Maestro", dataRequest.bodyDownload, dataRequest.authorizationToken);
        const validationMaestroChoice = await validatorController.valid("maestrotfile", maestroChoice);

        if (!validationMaestroChoice.success) {
            vscode.window.showWarningMessage(validationMaestroChoice.message);
            return;
        }

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
                    access_token: token
                }
            },
            pathMaestro: "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const filesCreated = await createMaestroFiles(workspacePath, maestroChoice);
        if (!filesCreated.success) {
            vscode.window.showWarningMessage(filesCreated.message);
            return;
        }
        const configPath = path.join(filesCreated.path, 'maestro.config.json'); // Cria o arquivo dentro do próprio diretório do maestro.
        config.pathMaestro = filesCreated.path;

        if (!saveMaestroConfig(configPath, config)) {
            vscode.window.showWarningMessage("O arquivo maestro.config.json já existe.");
            return;
        }
        vscode.window.showInformationMessage('✅ Arquivo maestro.config.json criado com sucesso!');
    }
}
