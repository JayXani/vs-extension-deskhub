import * as vscode from 'vscode';
import { MaestroListenerController } from '../../App/Controllers/MaestroListenerController';

export function registerListenerFolder(context: vscode.ExtensionContext) {
    // Assiste arquivos .py
    const watcherChange = vscode.workspace.onDidRenameFiles(async (e) => await new MaestroListenerController(vscode).execute(e));
    context.subscriptions.push(watcherChange);
}
