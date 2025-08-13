import { ErrorCodes } from "./ErrorCodes";
import { GeneralError } from "./GeneralError";

export class MaestroRootEmptyError extends GeneralError {
    constructor(message: string){ 
        super({
            type: "MaestroRootEmptyError",
            message: message,
            code: ErrorCodes.MAESTRO_ROOT_EMPTY_ERROR,
        });
    }
}