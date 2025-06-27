import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function registerInitCommand(context: vscode.ExtensionContext) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]; // Valida se tem alguma pasta aberta no vscode

  if (!workspaceFolder) {
    vscode.window.showWarningMessage('❌ Nenhuma pasta foi aberta no VS Code.');
    return;
  }

  const configPath = path.join(workspaceFolder.uri.fsPath, 'maestro.config.json');

  const command = vscode.commands.registerCommand('maestro.init', () => {
    if (fs.existsSync(configPath)) {
      vscode.window.showWarningMessage('⚠️ O arquivo maestro.config.json já existe.');
      return;
    }

    const defaultConfig = {
      name: 'Nome do maestro',
      key: 'Chave interna do maestro',
      prefixo: 'Prefixo do maestro',
      author: "Nome do autor",
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
