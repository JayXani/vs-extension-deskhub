import * as vscode from 'vscode';
import { MaestroListenerService } from '../Services/MaestroListenerService';

export function registerListenerFolder(context: vscode.ExtensionContext) {
    // Assiste arquivos .py
    const watcherChange = vscode.workspace.onDidRenameFiles(async (e) => await new MaestroListenerService().run(e));
    context.subscriptions.push(watcherChange);
}
