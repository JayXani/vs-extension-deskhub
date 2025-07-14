import * as vscode from 'vscode';
import { registerInitCommand } from './commands/registerInitCommand';
import registerUploadCommand from './commands/registerUploadCommand';

export function activate(context: vscode.ExtensionContext) {
  registerInitCommand(context);
  registerUploadCommand(context);
}

export function deactivate() {}
