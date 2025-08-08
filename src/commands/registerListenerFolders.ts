import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { showMessage } from '../utils/showMessage';
import { messages } from '../utils/messages';
import { IMaestroConfig } from '../interfaces/IMaestroConfig';
import { escapeRegex } from '../utils/normalizeString';
import { apiDeskManager } from '../api/http-request';
import { IMaestroResponse } from '../interfaces/IMaestroRequests';
import { decodeBase64 } from '../utils/decodeBase64';
import { encodeBase64 } from '../utils/encondeBase64';
import { RequestsValidatorsController } from '../Controller/RequestsValidatorsController';

export function registerListenerFolder(context: vscode.ExtensionContext) {
    // Assiste arquivos .py
    const watcherChange = vscode.workspace.onDidRenameFiles((e) => changeFiles(e));
    context.subscriptions.push(watcherChange);
}

const changeFiles = async (event: vscode.FileRenameEvent) => {
    const validator = new RequestsValidatorsController();
    for (const file of event.files) {
        const oldPath = file.oldUri.fsPath;
        const newPath = file.newUri.fsPath;

        if (!oldPath.endsWith('.py') || !newPath.endsWith('.py')) { continue; }

        // Verifica se estão em uma pasta chamada "Maestro"
        const maestroDir = findMaestroFolder(newPath);
        if (!maestroDir) { continue; }

        const configPath = path.join(maestroDir, 'maestro.config.json');
        if (!fs.existsSync(configPath)) { throw new Error(messages.errors.maestro_config_not_found + maestroDir); }
        try {
            const configContent = fs.readFileSync(configPath, 'utf-8');
            const config: IMaestroConfig = JSON.parse(configContent) as IMaestroConfig;
            const token = await apiDeskManager("Login/autenticar", { PublicKey: config.publicKey }, config.apiKey);

            // Regex para splitar as barras no mac, windows e linux
            const newName = newPath.split(/[/\\]/).pop().trim().replace(".py", "");
            const oldName = oldPath.split(/[/\\]/).pop().trim().replace(".py", "");
            const regex = new RegExp(escapeRegex(`${oldName}`), 'g');

            const maestro: IMaestroResponse = await apiDeskManager("Maestro", { Chave: config.key }, token);
            if (!maestro || "erro" in maestro) { throw new Error(messages.errors.maestro_name_rollback); }

            const flowDecoded = decodeBase64(maestro.TMaestro.Fluxo);
            if ("error" in flowDecoded) { throw new Error(flowDecoded.error); }

            flowDecoded.data = flowDecoded.data.replace(regex, `${newName.trim()}`);
            const validatorToUpdate = await validator.valid("to_update", flowDecoded.data, newName);
            if (!validatorToUpdate.success) { throw new Error(validatorToUpdate.message); }

            const fluxoEnconded = encodeBase64(flowDecoded.data);
            if (fluxoEnconded.error) { throw Error(fluxoEnconded.error); }
            maestro.TMaestro.Fluxo = fluxoEnconded.data;

            const maestroUpdated = await apiDeskManager("Maestro", maestro, token, "application/json", "PUT");
            if ("erro" in maestroUpdated) { throw new Error(messages.errors.http_maestro_response_error.concat("Falha na requisição")); }

            return showMessage("information", messages.success.file_name_update, vscode);
        } catch (error) {
            fs.renameSync(newPath, oldPath);
            return showMessage('error', messages.errors.exception + error, vscode);
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
