import * as vscode from 'vscode';
import { registerInitCommand } from './commands/registerInitCommand';

export function activate(context: vscode.ExtensionContext) {
  registerInitCommand(context);
}

export function deactivate() {}
