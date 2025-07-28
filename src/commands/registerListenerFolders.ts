import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { showMessage } from '../utils/showMessage';
import { messages } from '../utils/messages';
import { IMaestroConfig } from '../interfaces/IMaestroConfig';

export function registerListenerFolder(context: vscode.ExtensionContext) {
    const watcher = vscode.workspace.createFileSystemWatcher('**/*.py');
    const watcherChange = vscode.workspace.onDidRenameFiles((e) => changeFiles(e));
    const watcherDelete = vscode.workspace.onDidCreateFiles((e) => changeFiles(e));
    const watcherCreate = vscode.workspace.onDidDeleteFiles((e) => changeFiles(e));

    context.subscriptions.push(watcher);
}
const changeFiles = (event: vscode.FileChangeEvent | vscode.FileCreateEvent | vscode.FileDeleteEvent) => {

};
