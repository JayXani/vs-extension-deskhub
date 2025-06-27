import * as vscode from 'vscode';
import { registerInitCommand } from './commands/registerInitCommand';

export function activate(context: vscode.ExtensionContext) {
  console.log('🟢 Extensão DeskHub ativada!');
  registerInitCommand(context);
}

export function deactivate() {}
