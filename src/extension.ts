import * as vscode from 'vscode';
import { registerInitCommand } from './commands/registerInitCommand';
import registerUploadCommand from './commands/registerUploadCommand';
import { registerTreeCommand } from './commands/registerTreeCommand';
import { registerListenerFolder } from './commands/registerListenerFolders';
import { registerMergeMaestro } from './commands/registerMergeMaestro';


export function activate(context: vscode.ExtensionContext) {
  registerMergeMaestro(context);
  registerInitCommand(context);
  registerUploadCommand(context);
  registerTreeCommand(context);
  registerListenerFolder(context);
}

export function deactivate() { }
