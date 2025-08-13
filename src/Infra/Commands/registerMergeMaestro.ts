import * as vscode from 'vscode';
import { MaestroMergeService } from '../../App/Services/MaestroMergeService';
import { showMessage } from '../../Shared/ui/showMessage';

export const registerMergeMaestro = async (context: vscode.ExtensionContext) => {
    const command = vscode.commands.registerCommand("maestro.merge", async () => {
        const workspace = vscode.workspace.workspaceFolders?.[0];
        if (!workspace) { return showMessage("error", "Nenhuma pasta do vscode aberta", vscode); }
        const maestroInit = new MaestroMergeService(vscode);
        await maestroInit.run(workspace.uri.fsPath);
    });
    context.subscriptions.push(command);
};