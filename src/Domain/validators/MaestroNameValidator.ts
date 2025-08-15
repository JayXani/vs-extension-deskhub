import { IMaestroFile } from "../types/IMaestroFile";
import { IValidatorProcess } from "../types/IValidatorProcess";
import { messagesV2 } from "../../Shared/constants/messages-v2";
import { normalizeToUnderscore } from "../../Shared/helpers/normalizeString";
import { MaestroNameNotIsValid } from "../errors/MaestroNameNotIsValid";
import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { SuccessCodes } from "../../Shared/constants/SuccessCodes";

export class MaestroNameValidator implements IValidatorProcess {
    process(maestroConfig: string, newName: string): { success: boolean; message: string; } {
        const maestroFile: IMaestroFile = JSON.parse(maestroConfig);
        let config = maestroFile.config;
        let occurrencesNames = 0;
        if (typeof maestroFile.config === "string") { config = JSON.parse(maestroFile.config); }

        for (const cfg of config) {
            // Valida se o nome do parse está na formatação incorreta, caso sim, retorne o erro.
            if ((/[^a-zA-Z0-9\s?_?]/g.test(cfg.name))) { throw new MaestroNameNotIsValid(messagesV2.errors[ErrorCodes.MAESTRO_NAME_NOT_IS_VALID]); }
            const confNameReplaced = cfg.name.replace("PARSE_", "").trim();
            if (normalizeToUnderscore(confNameReplaced) === normalizeToUnderscore(newName)) { occurrencesNames += 1; }
        }
        if (occurrencesNames > 1) {
            throw new MaestroNameNotIsValid(messagesV2.errors[ErrorCodes.MAESTRO_NAME_PARSE_EXISTS]);
        }
        return {
            success: true,
            message: messagesV2.success[SuccessCodes.SUCCESS_DATA_REQUEST_VALID]
        };
    }
}