import * as fs from 'fs';
import { MaestroFolderExceptionError } from '../../Domain/errors/MaestroFolderExceptionError';
import { messagesV2 } from '../../Shared/constants/messages-v2';
import { ErrorCodes } from '../../Shared/constants/ErrorCodes';

export function saveMaestroConfig(configPath: string, configData: any): boolean {
    if (fs.existsSync(configPath)) { throw new MaestroFolderExceptionError(messagesV2.errors[ErrorCodes.MAESTRO_EXCEPTION_FOLDER]); }
    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
    return true;
}
