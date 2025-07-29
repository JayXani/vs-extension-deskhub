import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { showMessage } from '../utils/showMessage';
import { messages } from '../utils/messages';
import { IMaestroConfig } from '../interfaces/IMaestroConfig';
import { normalizeToUnderscore } from '../utils/normalizeString';

export function registerListenerFolder(context: vscode.ExtensionContext) {
    // Assiste arquivos .py
    const watcherChange = vscode.workspace.onDidRenameFiles((e) => changeFiles(e));
    context.subscriptions.push(watcherChange);
}

const changeFiles = (event: vscode.FileRenameEvent) => {
    for (const file of event.files) {
        const oldPath = file.oldUri.fsPath;
        const newPath = file.newUri.fsPath;

        if (!oldPath.endsWith('.py') || !newPath.endsWith('.py')) { continue; }

        // Verifica se estão em uma pasta chamada "Maestro"
        const maestroDir = findMaestroFolder(newPath);
        if (!maestroDir) { continue; }

        const configPath = path.join(maestroDir, 'maestro.config.json');

        if (!fs.existsSync(configPath)) {
            showMessage("warning", messages.errors.maestro_config_not_found + maestroDir, vscode);
            continue;
        }

        let config: IMaestroConfig;
        try {
            const configContent = fs.readFileSync(configPath, 'utf-8');
            config = JSON.parse(configContent) as IMaestroConfig;

            const oldName = oldPath.split("\\").pop();
            const newName = newPath.split("\\").pop();

            if (!oldName || !newName) { return; }

            for (const tree of config.tree) {
                for (let i = 0; i < tree.length; i++) {
                    const nameFormatted = oldName.toLowerCase().trim().replace(".py", "");
                    if (tree[i].toLowerCase().trim().includes(nameFormatted)) {
                        tree[i] = `PARSE_${normalizeToUnderscore(newName.replace(".py", ""))}`;
                    }
                }
            }
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2)); // Com identação
        } catch (error) {
            showMessage('error', messages.errors.maestro_config_not_loaded + error, vscode);
            return;
        }

    }
};

/**
 * Procura a pasta "Maestro" acima do caminho dado.
 */
function findMaestroFolder(filePath: string): string | null {
    let current = path.dirname(filePath);

    while (current && current !== path.dirname(current)) {
        if (path.basename(current).toLowerCase().includes('maestro')) {
            return current;
        }
        current = path.dirname(current);
    }

    return null;
}
