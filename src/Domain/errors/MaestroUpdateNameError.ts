import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { GeneralError } from "./GeneralError";

export class MaestroUpdateNameError extends GeneralError {
    constructor(message: string) {
        super({
            type: "MaestroUpdateNameError",
            message: message,
            code: ErrorCodes.MAESTRO_NAME_ERROR,
        });
    }
}