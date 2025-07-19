import * as vscode from 'vscode';
import { getTreeHtml } from '../utils/getTreeHTML';
import { MaestroConstructorFlux } from '../Services/MaestroConstructorFluxo';

export function registerTreeCommand(context: vscode.ExtensionContext) {
    const command = vscode.commands.registerCommand('maestro.tree', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showWarningMessage('Nenhuma pasta foi aberta no VS Code.');
            return;
        }
        const panel = vscode.window.createWebviewPanel( // Essa função permite criar uma tela de visualizacao com base em um HTML
            'folderTree',
            'Árvore de Pastas', // Nome do arquivo que será aberto
            vscode.ViewColumn.One,
            {
                enableScripts: true // Habilita que o HTML rode scripts
            }
        );

        const service = new MaestroConstructorFlux();
        await service.run(workspaceFolder.uri.fsPath, vscode);
        const treeHtml = getTreeHtml(workspaceFolder.uri.fsPath);
        panel.webview.html = treeHtml;
    });

    context.subscriptions.push(command);
}
