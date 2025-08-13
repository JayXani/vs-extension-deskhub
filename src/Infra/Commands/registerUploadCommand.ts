import * as vscode from 'vscode';
import { MaestroUpdateController } from '../../App/Controllers/MaestroUpdateController';
const registerUploadCommand = async (context: vscode.ExtensionContext) => {
    const command = vscode.commands.registerCommand("maestro.upload", async () => {
        const workspace = vscode.workspace.workspaceFolders?.[0];
        if (!workspace) {
            vscode.window.showInformationMessage('Nenhuma pasta foi aberta no VS Code.');
            return;
        }
        const maestroUploadController = new MaestroUpdateController(vscode);
        await maestroUploadController.execute(workspace.uri.fsPath);
    });

    context.subscriptions.push(command);
};

export default registerUploadCommand;