import * as vscode from 'vscode';
import { MaestroConstructorFlowController } from '../../App/Controllers/MaestroConstructorFlowController';

export function registerConstructorFlow(context: vscode.ExtensionContext) {
    const command = vscode.commands.registerCommand('maestro.tree', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showWarningMessage('Nenhuma pasta foi aberta no VS Code.');
            return;
        }

        const controller = new MaestroConstructorFlowController(vscode);
        await controller.execute(workspaceFolder.uri.fsPath);
    });

    context.subscriptions.push(command);
}
