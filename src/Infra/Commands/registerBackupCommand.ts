import * as vscode from 'vscode';
import { MaestroBackupController } from '../../App/Controllers/MaestroBackupController';

export function registerBackupCommand(context: vscode.ExtensionContext) {
    const command = vscode.commands.registerCommand('maestro.backup', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showWarningMessage('Nenhuma pasta foi aberta no VS Code.');
            return;
        }
        const maestroBackupController = new MaestroBackupController(vscode);
        await maestroBackupController.execute(workspaceFolder.uri.fsPath);
    });

    context.subscriptions.push(command);
}