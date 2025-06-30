import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { MaestroConfig } from '../types/maestro-config';

export async function registerInitCommand(context: vscode.ExtensionContext) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]; // Valida se tem alguma pasta aberta no vscode

  if (!workspaceFolder) {
    vscode.window.showWarningMessage('Nenhuma pasta foi aberta no VS Code.');
    return;
  }

  const urlMaestro = await vscode.window.showInputBox({
    prompt: "Digite a url PUT/POST do seu maestro:",
    placeHolder: "https://abc12398soism.../?token=TOKEN",
    ignoreFocusOut: false
  });

  if(!/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(urlMaestro)){
    vscode.window.showErrorMessage("URL inválida, por gentileza, copie a URL correta do maestro.");
    return;
  }

  const configPath = path.join(workspaceFolder.uri.fsPath, 'maestro.config.json');
  const command = vscode.commands.registerCommand('maestro.init', () => {
    if (fs.existsSync(configPath)) {
      vscode.window.showWarningMessage('O arquivo maestro.config.json já existe.');
      return;
    }

    const defaultConfig: MaestroConfig = {
      name: 'Nome do maestro',
      key: 'Chave interna do maestro',
      prefixo: 'Prefixo do maestro',
      author: "Nome do autor",
      url_post: urlMaestro,
      url_get: urlMaestro,
      memoria: {
        BEGIN_init: {},
        CRON: {
          access_token: "token de acesso a Desk Manager"
        }
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    vscode.window.showInformationMessage('✅ Arquivo maestro.config.json criado com sucesso!');
  });

  context.subscriptions.push(command);
}
