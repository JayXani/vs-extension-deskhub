import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const registerDocsCommand = (context: vscode.ExtensionContext) => {
    const workspace = vscode.workspace.workspaceFile?.[0];
    if (!workspace) {
        vscode.window.showInformationMessage('Nenhuma pasta foi aberta no VS Code.');
        return;
    }

};

export default registerDocsCommand;