import { IMaestroFile } from "../types/IMaestroFile";
import { IValidatorProcess } from "../types/IValidatorProcess";
import { messages } from "../../Shared/constants/messages";
import { normalizeToUnderscore } from "../../Shared/helpers/normalizeString";

export class MaestroNameValidator implements IValidatorProcess {
    process(maestroConfig: string, newName: string): { success: boolean; message: string; } {
        try {
            const maestroFile: IMaestroFile = JSON.parse(maestroConfig);
            let config = maestroFile.config;
            let occurrencesNames = 0;
            if (typeof maestroFile.config === "string") { config = JSON.parse(maestroFile.config); }

            for (const cfg of config) {
                // Valida se o nome do parse está na formatação incorreta, caso sim, retorne o erro.
                if ((/[^a-zA-Z0-9\s?_?]/g.test(cfg.name))) {
                    return {
                        success: false,
                        message: messages.errors.name_not_is_valid
                    };
                }
                const confNameReplaced = cfg.name.replace("PARSE_", "").trim();
                if (normalizeToUnderscore(confNameReplaced) === normalizeToUnderscore(newName)) { occurrencesNames += 1; }
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