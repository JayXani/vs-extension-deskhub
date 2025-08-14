import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { GeneralError } from "./GeneralError";

export class MaestroFolderExceptionError extends GeneralError {
    constructor(message: string) {
        super({
            type: "MaestroFolderExceptionError",
            message: message,
            code: ErrorCodes.MAESTRO_CONFIG_CONTENT_ERROR,
        });
    }
}