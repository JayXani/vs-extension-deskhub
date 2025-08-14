import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { GeneralError } from "./GeneralError";

export class MaestroConfigNotFoundError extends GeneralError {
    constructor(message: string) {
        super({
            type: "MaestroConfigNotFoundError",
            message: message,
            code: ErrorCodes.MAESTRO_CONFIG_NOT_FOUND_ERROR,
        });
    }
}