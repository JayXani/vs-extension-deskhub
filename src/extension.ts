import * as vscode from 'vscode';
import { registerMergeMaestro } from './Infra/Commands/registerMergeMaestro';
import registerUploadCommand from './Infra/Commands/registerUploadCommand';
import { registerConstructorFlow } from './Infra/Commands/registerConstructorFlow';
import { registerInitCommand } from './Infra/Commands/registerInitCommand';
import { registerListenerFolder } from './Infra/Commands/registerListenerFolders';

export function activate(context: vscode.ExtensionContext) {
  registerMergeMaestro(context);
  registerInitCommand(context);
  registerUploadCommand(context);
  registerConstructorFlow(context);
  registerListenerFolder(context);
}

export function deactivate() { }
