import { ErrorCodes } from "./ErrorCodes";
import { GeneralError } from "./GeneralError";

export class MaestroBase64Error extends GeneralError {
    constructor(message: string){ 
        super({
            type: "MaestroBase64Error",
            message: message,
            code: ErrorCodes.MAESTRO_BASE64_ERROR,
        });
    }
}