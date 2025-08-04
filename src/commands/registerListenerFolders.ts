import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { showMessage } from '../utils/showMessage';
import { messages } from '../utils/messages';
import { IMaestroConfig } from '../interfaces/IMaestroConfig';
import { normalizeToUnderscore } from '../utils/normalizeString';
import { apiDeskManager } from '../api/http-request';
import { IMaestroResponse } from '../interfaces/IMaestroRequests';
import { IMaestroFile, IMaestroTree } from '../interfaces/IMaestroFile';
import { decodeBase64 } from '../utils/decodeBase64';
import { encodeBase64 } from '../utils/encondeBase64';

export function registerListenerFolder(context: vscode.ExtensionContext) {
    // Assiste arquivos .py
    const watcherChange = vscode.workspace.onDidRenameFiles((e) => changeFiles(e));
    context.subscriptions.push(watcherChange);
}

const changeFiles = async (event: vscode.FileRenameEvent) => {
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
        try {
            const configContent = fs.readFileSync(configPath, 'utf-8');
            const config: IMaestroConfig = JSON.parse(configContent) as IMaestroConfig;
            const token = await apiDeskManager("Login/autenticar", { PublicKey: config.publicKey }, config.apiKey);

            // Regex para splitar as barras no mac, windows e linux
            const newName = newPath.split(/[/\\]/).pop();

            const maestro: IMaestroResponse = await apiDeskManager("Maestro", { Chave: config.key }, token);
            if (!maestro || "erro" in maestro) {
                fs.renameSync(newPath, oldPath);
                return showMessage("error", messages.errors.maestro_name_rollback, vscode);
            }

            const fluxoDecoded = decodeBase64(maestro.TMaestro.Fluxo);
            if ("error" in fluxoDecoded) { return showMessage("error", fluxoDecoded.error, vscode); }

            const fluxoJSON: IMaestroFile = JSON.parse(fluxoDecoded.data);
            const maestroConfig = fluxoJSON.config;

            //Altera toda a estrutura da arvore original
            maestroConfig.forEach((conf) => {
                console.log(conf);
                if (normalizeToUnderscore(conf.name) === normalizeToUnderscore(conf.name)) {
                    const originalTree = fluxoJSON.tree.split(";").map((n) => n.split("."));
                    originalTree.forEach((nodes) => {
                        nodes.forEach((node) => {
                            if (normalizeToUnderscore(node) === newName) { node = newName; }
                        });
                    });
                    conf.name = newName;

                }
            });

            const fluxoEnconded = encodeBase64(JSON.stringify(fluxoJSON));
            if ("error" in fluxoEnconded) { return showMessage("error", fluxoEnconded.error, vscode); }

            maestro.TMaestro.Fluxo = fluxoEnconded.data;
            console.log(maestro);

            const maestroUpdated = await apiDeskManager("Maestro", maestro, token, "application/json", "PUT");

            fs.writeFileSync(configPath, JSON.stringify(config, null, 2)); // Com identação
        } catch (error) {
            return showMessage('error', messages.errors.maestro_config_not_loaded + error, vscode);
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
