import * as vscode from 'vscode';
import { IMaestroList } from '../interfaces/IMaestroRequests';

// Método abaixo temporariamente indisponivel.
export async function promptAuthorizationType(): Promise<string | undefined> {
    const options = ['Chave de API'];
    const choice = await vscode.window.showQuickPick(options, {
        placeHolder: 'Escolha um método de autenticação.'
    });
    return choice;
}


export async function promptGetToken(): Promise<string | undefined> {
    return vscode.window.showInputBox({
        prompt: "Informe o token temporário de autenticação:",
        ignoreFocusOut: false
    });
}

export async function promptPostUrl(): Promise<string | undefined> {
    return vscode.window.showInputBox({
        prompt: "Informe a URL POST do maestro:",
        ignoreFocusOut: false
    });
}

export async function promptMaestro(maestroList: IMaestroList) {
    const quickPickItems = maestroList.root.map(item => ({
        label: item.Nome,
        description: `Chave interna: ${item.Chave}`,
        key: item.Chave
    }));
    return vscode.window.showQuickPick(quickPickItems, {
        placeHolder: 'Escolha um Maestro para configurar'
    });
}
