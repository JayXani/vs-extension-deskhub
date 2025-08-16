import * as vscode from 'vscode';
import { showMessage } from '../../Shared/ui/showMessage';
import { MaestroMergeController } from '../../App/Controllers/MaestroMergeController';
import { VSCodePrompts } from '../prompts/VSCodePrompts';

export const registerMergeMaestro = async (context: vscode.ExtensionContext) => {
    const command = vscode.commands.registerCommand("maestro.merge", async () => {
        const workspace = vscode.workspace.workspaceFolders?.[0];
        if (!workspace) { return showMessage("error", "Nenhuma pasta do vscode aberta", vscode); }
        const maestroInit = new MaestroMergeController(vscode);
        await maestroInit.execute(workspace.uri.fsPath);
    });
    context.subscriptions.push(command);
};