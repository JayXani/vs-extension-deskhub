import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { GeneralError } from "./GeneralError";

export class MaestroContentConfigError extends GeneralError {
    constructor(message: string) {
        super({
            type: "MaestroContentConfig",
            message: message,
            code: ErrorCodes.MAESTRO_CONFIG_CONTENT_ERROR,
        });
    }
}