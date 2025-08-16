import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { messagesV2 } from '../../Shared/constants/messages-v2';
import { IMaestroConfig } from '../../Domain/types/IMaestroConfig';
import { escapeRegex } from '../../Shared/helpers/normalizeString';
import { IMaestroResponse } from '../../Domain/types/IMaestroRequests';
import { decodeBase64 } from '../../Shared/helpers/decodeBase64';
import { encodeBase64 } from '../../Shared/helpers/encondeBase64';
import { MaestroValidatorService } from './MaestroValidatorService';
import { apiDeskManager } from '../../Infra/api/http-request';
import { formatErrorResponse } from '../../Domain/errors/formatErrorResponse';
import { MaestroUpdateNameError } from '../../Domain/errors/MaestroUpdateNameError';
import { ErrorCodes } from '../../Shared/constants/ErrorCodes';
import { MaestroConfigNotFoundError } from '../../Domain/errors/MaestroConfigNotFoundError';
import { MaestroNotFoundError } from '../../Domain/errors/MaestroNotFoundError';
import { SuccessCodes } from '../../Shared/constants/SuccessCodes';
import { MaestroBase64Error } from '../../Domain/errors/MaestroBase64Error';
import { MaestroDomainService } from './MaestroDomainService';
import { VSCodePrompts } from '../../Infra/prompts/VSCodePrompts';

export class MaestroListenerService extends MaestroDomainService{
    constructor(vscode: any, prompt: VSCodePrompts){
        super(vscode, prompt);
    }
    async run(event: vscode.FileRenameEvent) {
        const validator = new MaestroValidatorService();
        for (const file of event.files) {
            const oldPath = file.oldUri.fsPath;
            const newPath = file.newUri.fsPath;

            if (!oldPath.endsWith('.py') || !newPath.endsWith('.py')) { continue; }

            // Verifica se estão em uma pasta chamada "Maestro"
            const maestroDir = findMaestroFolder(newPath);
            if (!maestroDir) { continue; }

            const configPath = path.join(maestroDir, 'maestro.config.json');
            if (!fs.existsSync(configPath)) { throw new MaestroConfigNotFoundError(messagesV2.errors[ErrorCodes.MAESTRO_CONFIG_NOT_FOUND_ERROR] + maestroDir); }
            try {
                const configContent = fs.readFileSync(configPath, 'utf-8');
                const config: IMaestroConfig = JSON.parse(configContent) as IMaestroConfig;
                const token = await apiDeskManager("Login/autenticar", { PublicKey: config.publicKey }, config.apiKey);

                // Regex para splitar as barras no mac, windows e linux
                const newName = newPath.split(/[/\\]/).pop().trim().replace(".py", "");
                const oldName = oldPath.split(/[/\\]/).pop().trim().replace(".py", "");
                const regex = new RegExp(escapeRegex(`${oldName}`), 'g');

                const maestro: IMaestroResponse = await apiDeskManager("Maestro", { Chave: config.key }, token);
                if (!maestro || "erro" in maestro) { throw new MaestroUpdateNameError(messagesV2.errors[ErrorCodes.MAESTRO_NAME_ERROR]); }

                const flowDecoded = decodeBase64(maestro.TMaestro.Fluxo as string);
                if ("error" in flowDecoded) { throw new MaestroBase64Error(flowDecoded.error); }

                flowDecoded.data = flowDecoded.data.replace(regex, `${newName.trim()}`);
                await validator.valid("to_update", flowDecoded.data, newName);
                
                const flowEncoded = encodeBase64(flowDecoded.data);
                if (flowEncoded.error) { throw new MaestroBase64Error(flowEncoded.error); }
                maestro.TMaestro.Fluxo = flowEncoded.data;

                const maestroUpdated = await apiDeskManager("Maestro", maestro, token, "application/json", "PUT");
                if ("erro" in maestroUpdated) { 
                    throw new MaestroNotFoundError(messagesV2.errors[ErrorCodes.MAESTRO_NOT_UPDATE].concat("Falha na tentativa de atualizar.")); 
                }

                return {
                    success: true,
                    message: messagesV2.success[SuccessCodes.SUCCESS_RENAME_FOLDER]
                };
            } catch (error) {
                fs.renameSync(newPath, oldPath);
                return formatErrorResponse(error);
            }
        }
    }
}

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
