import * as vscode from 'vscode';
import { showMessage } from '../utils/showMessage';
import { MaestroMergeService } from '../Services/MaestroMergeService';

export const registerMergeMaestro = async (context: vscode.ExtensionContext) => {
    const command = vscode.commands.registerCommand("maestro.merge", async () => {
        const workspace = vscode.workspace.workspaceFolders?.[0];
        if (!workspace) { return showMessage("error", "Nenhuma pasta do vscode aberta", vscode); }
        const maestroInit = new MaestroMergeService();
        await maestroInit.run(workspace.uri.fsPath, vscode);
    });
    context.subscriptions.push(command);
};