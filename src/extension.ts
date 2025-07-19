import * as vscode from 'vscode';
import { registerInitCommand } from './commands/registerInitCommand';
import registerUploadCommand from './commands/registerUploadCommand';
import { registerTreeCommand } from './commands/registerTreeCommand';


export function activate(context: vscode.ExtensionContext) {
  registerInitCommand(context);
  registerUploadCommand(context);
  registerTreeCommand(context);
}

export function deactivate() { }
