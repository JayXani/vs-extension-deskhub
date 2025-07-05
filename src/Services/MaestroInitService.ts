import * as os from 'os';
import * as path from 'path';
import { IMaestroConfig } from '../interfaces/IMaestroConfig';
import { IDataRequest } from '../interfaces/IDataRequest';

import * as vscode from 'vscode';
import { RequestsValidatorsController } from '../Controller/RequestsValidatorsController';
import { promptGetToken, promptMaestro, promptPostUrl } from '../utils/prompts';
import { saveMaestroConfig } from '../utils/maestroFileWritterConfig';
import { apiDeskManager } from '../api/http-request';
import { IMaestroList } from '../interfaces/IMaestroList';
import { extractPrefixFromUrl } from '../utils/getPrefixo';

export class MaestroInitService {
    async run(workspacePath: string) {
        const validatorController = new RequestsValidatorsController();
        const urlPost = await promptPostUrl();
        const token = await promptGetToken();

        const dataRequest: IDataRequest = {
            authorizationToken: token,
            url: urlPost,
            bodyList: {
                Pesquisa: "",
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
        if (!maestroList.root.length) {
            vscode.window.showWarningMessage("ATENÇÃO !\n\nNão encontramos nenhum maestro com os dados informado.");
            return;
        }
        const maestroChoosed = await promptMaestro(maestroList);
        if (!maestroChoosed) {
            vscode.window.showWarningMessage("Nenhum maestro selecionado.");
            return;
        }
        vscode.window.showInformationMessage("Aguarde enquanto buscamos pelo seu maestro...");
        dataRequest.bodyDownload.Chave = maestroChoosed.key.toString();
        const maestroChoice = await apiDeskManager("Maestro", dataRequest.bodyDownload, dataRequest.authorizationToken);

        const config: IMaestroConfig = {
            name: maestroChoosed.label,
            key: maestroChoosed.key,
            prefixo: extractPrefixFromUrl(urlPost),
            author: os.hostname(),
            url_post: urlPost,
            url_get: '',
            publicKey: '',
            apiKey: '',
            memoria: {
                BEGIN_init: {},
                CRON: {
                    access_token: ''
                }
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const configPath = path.join(workspacePath, 'maestro.config.json');
        if (!saveMaestroConfig(configPath, config)) {
            vscode.window.showWarningMessage("O arquivo maestro.config.json já existe.");
            return;
        }

        vscode.window.showInformationMessage('✅ Arquivo maestro.config.json criado com sucesso!');
    }
}
