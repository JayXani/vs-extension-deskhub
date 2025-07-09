import { IPathValidation } from "../interfaces/IPathValidation";
import { IValidatorProcess } from "../interfaces/IValidatorProcess";
import { messages } from "../utils/messages";
import * as fs from "fs";

export class FolderValidator implements IValidatorProcess {
    process(pathValidation: IPathValidation): { success: boolean; message: string; } {
        try {
            const folders = fs.readdirSync(pathValidation.basePath, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);

            const folderAlreadyExists = folders.some(folderName => folderName.includes(pathValidation.keyMaestro));
            // Valida também o caminho completo do maestro
            if (folderAlreadyExists || fs.existsSync(pathValidation.fullPathMaestro)) { // Valida primeiro se existe algum maestro no caminho das pastas que contenha a mesma chave do maestro.
                return {
                    success: false,
                    message: messages.errors.folder_exists.concat(`Chave ${pathValidation.keyMaestro}`)
                };
            }
            return {
                success: true,
                message: messages.success.validation_request
            };
        } catch (e) {
            return {
                success: false,
                message: messages.errors.folder_exception
            };
        }
    }

}