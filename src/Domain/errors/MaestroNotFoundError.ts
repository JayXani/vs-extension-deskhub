import { ErrorCodes } from "./ErrorCodes";
import { GeneralError } from "./GeneralError";

export class MaestroNotFoundError extends GeneralError {
    constructor(message: string){ 
        super({
            type: "MaestroNotFoundError",
            message: message,
            code: ErrorCodes.MAESTRO_NOT_FOUND_ERROR,
        });
    }
}