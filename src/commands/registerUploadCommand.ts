import * as vscode from 'vscode';
import { MaestroUploadService } from '../Services/MaestroUploadService';

const registerUploadCommand = async (context: vscode.ExtensionContext) => {
    const command = vscode.commands.registerCommand("maestro.upload", async () => {
        const workspace = vscode.workspace.workspaceFolders?.[0];
        if (!workspace) {
            vscode.window.showInformationMessage('Nenhuma pasta foi aberta no VS Code.');
            return;
        }
        const maestroUpload = new MaestroUploadService();
        await maestroUpload.run(workspace.uri.fsPath, vscode);
    });

    context.subscriptions.push(command);
};

export default registerUploadCommand;