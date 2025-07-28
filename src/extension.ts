import * as vscode from 'vscode';
import { registerInitCommand } from './commands/registerInitCommand';
import registerUploadCommand from './commands/registerUploadCommand';
import { registerTreeCommand } from './commands/registerTreeCommand';
import { registerListenerFolder } from './commands/registerListenerFolders';


export function activate(context: vscode.ExtensionContext) {
  registerInitCommand(context);
  registerUploadCommand(context);
  registerTreeCommand(context);
  registerListenerFolder(context);
}

export function deactivate() { }
