import * as vscode from 'vscode';
import { MaestroInitService } from '../Services/MaestroInitService';

export function registerInitCommand(context: vscode.ExtensionContext) {
    const command = vscode.commands.registerCommand('maestro.init', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showWarningMessage('Nenhuma pasta foi aberta no VS Code.');
            return;
        }

        const service = new MaestroInitService();
        await service.run(workspaceFolder.uri.fsPath);
    });

    context.subscriptions.push(command);
}
