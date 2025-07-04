import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import os from 'os';
import { IMaestroConfig } from '../interfaces/IMaestroConfig';
import { postListMaestro } from '../api/http-post-list-maestro';
import { IDataRequest } from '../interfaces/IDataRequest';
import { RequestsValidatorsController } from '../Controller/RequestsValidatorsController';

interface MaestroItem extends vscode.QuickPickItem {
    key: string;
}

export function registerInitCommand(context: vscode.ExtensionContext) {
    const command = vscode.commands.registerCommand('maestro.init', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        const validatorController = new RequestsValidatorsController();

        if (!workspaceFolder) {
            vscode.window.showWarningMessage('Nenhuma pasta foi aberta no VS Code.');
            return;
        }

        const token = await vscode.window.showInputBox({
            prompt: "Informe o token (Authorization) do seu operador:",
            ignoreFocusOut: false
        });

        const urlPost = await vscode.window.showInputBox({
            prompt: "Informe a URL POST do maestro:",
            ignoreFocusOut: false
        });
        const dataRequest: IDataRequest = {
            authorizationToken: token,
            url: urlPost,
            bodyList: {
                Pesquisa: ""
            }
        };
        const dataValidate = validatorController.valid("init", dataRequest);
        if (!dataValidate.success) { return vscode.window.showWarningMessage(dataValidate.message);}
        

        // Substitua isso futuramente pelo await postListMaestro(dataRequest);
        const maestroList = [
            { Nome: "Maestro 1", Chave: "chave1" },
            { Nome: "Maestro 2", Chave: "chave2" },
        ];

        const quickPickItems: MaestroItem[] = maestroList.map(item => ({
            label: item.Nome,
            description: `Chave interna: ${item.Chave}`,
            key: item.Chave
        }));

        const maestroChoosed = await vscode.window.showQuickPick(quickPickItems, {
            placeHolder: 'Escolha um Maestro para configurar'
        });

        if (!maestroChoosed) {
            vscode.window.showWarningMessage('Nenhum maestro foi selecionado.');
            return;
        }

        const configPath = path.join(workspaceFolder.uri.fsPath, 'maestro.config.json');

        if (fs.existsSync(configPath)) {
            vscode.window.showWarningMessage('O arquivo maestro.config.json já existe.');
            return;
        }

        const defaultConfig: IMaestroConfig = {
            name: maestroChoosed.label,
            key: maestroChoosed.key,
            prefixo: '', // Você pode pedir isso também, se quiser
            author: os.hostname(),
            url_post: urlPost,
            url_get: '',
            memoria: {
                BEGIN_init: {},
                CRON: {
                    access_token: token
                }
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
        vscode.window.showInformationMessage('✅ Arquivo maestro.config.json criado com sucesso!');
    });

    context.subscriptions.push(command);
}
