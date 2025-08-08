import { IMaestroFile } from "../interfaces/IMaestroFile";
import { IValidatorProcess } from "../interfaces/IValidatorProcess";
import { messages } from "../utils/messages";
import { normalizeToUnderscore } from "../utils/normalizeString";

export class MaestroNameValidator implements IValidatorProcess {
    process(maestroConfig: string, newName: string): { success: boolean; message: string; } {
        try {
            const maestroFile: IMaestroFile = JSON.parse(maestroConfig);
            let config = maestroFile.config;
            let occurrencesNames = 0;
            if (typeof maestroFile.config === "string") { config = JSON.parse(maestroFile.config); }

            for (const cfg of config) {
                if (!(/[a-zA-Z_]/.test(cfg.name))) {
                    return {
                        success: false,
                        message: messages.errors.name_not_is_valid
                    };
                }
                if (normalizeToUnderscore(cfg.name) === normalizeToUnderscore(newName)) { occurrencesNames += 1; }
            }
            if (occurrencesNames > 1) {
                return {
                    success: false,
                    message: "Erro ! Já existe um parse com o nome informado."
                };
            }
            return {
                success: true,
                message: "Sucesso ! Nome válido"
            };
        } catch (e) {
            return {
                success: false,
                message: messages.errors.folder_exception.concat(`: ${e}`)
            };
        }

    }
}