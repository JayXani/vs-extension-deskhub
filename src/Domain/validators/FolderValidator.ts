import * as fs from "fs";
import { IPathValidation } from "../types/IPathValidation";
import { IValidatorProcess } from "../types/IValidatorProcess";
import { MaestroAlreadyExists } from "../errors/MaestroAlreadyExists";
import { messagesV2 } from "../../Shared/constants/messages-v2";
import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { SuccessCodes } from "../../Shared/constants/SuccessCodes";

export class FolderValidator implements IValidatorProcess {
    process(pathValidation: IPathValidation): { success: boolean; message: string; } {
        const folders = fs.readdirSync(pathValidation.basePath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        const folderAlreadyExists = folders.some(folderName => folderName.includes(pathValidation.keyMaestro));
        // Valida também o caminho completo do maestro
        if (folderAlreadyExists || fs.existsSync(pathValidation.fullPathMaestro)) { // Valida primeiro se existe algum maestro no caminho das pastas que contenha a mesma chave do maestro.
            throw new MaestroAlreadyExists(messagesV2.errors[ErrorCodes.MAESTRO_ALREADY_EXISTS]);
        }
        return {
            success: true,
            message: messagesV2.errors[SuccessCodes.SUCCESS_DATA_REQUEST_VALID]
        };
    }
}