import * as vscode from 'vscode';
import { registerInitCommand } from './commands/registerInitCommand';
import registerDocsCommand from './commands/registerUploadCommand';

export function activate(context: vscode.ExtensionContext) {
  registerInitCommand(context);
  registerDocsCommand(context);
}

export function deactivate() {}
