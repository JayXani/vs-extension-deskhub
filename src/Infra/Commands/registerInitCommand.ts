import * as vscode from 'vscode';
import { MaestroInitService } from '../../App/Services/MaestroInitService';
import { MaestroInitController } from '../../App/Controllers/MaestroInitController';

export function registerInitCommand(context: vscode.ExtensionContext) {
    const command = vscode.commands.registerCommand('maestro.init', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showWarningMessage('Nenhuma pasta foi aberta no VS Code.');
            return;
        }
        const maestroInitController = new MaestroInitController(vscode);
        await maestroInitController.execute(workspaceFolder.uri.fsPath);
    });

    context.subscriptions.push(command);
}
