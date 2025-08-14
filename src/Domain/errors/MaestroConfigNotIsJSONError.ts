import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { GeneralError } from "./GeneralError";

export class MaestroConfigNotIsJSONError extends GeneralError {
    constructor(message: string) {
        super({
            type: "MaestroConfigNotIsJSONError",
            message: message,
            code: ErrorCodes.MAESTRO_CONFIG_IS_STRING_ERR0R,
        });
    }
}