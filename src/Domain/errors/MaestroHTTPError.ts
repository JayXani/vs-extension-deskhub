import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { GeneralError } from "./GeneralError";

export class MaestroHTTPError extends GeneralError {
    constructor(message: string) {
        super({
            type: "MaestroHTTPError",
            message: message,
            code: ErrorCodes.MAESTRO_IDENTIFIER_PYTHON_ERROR,
        });
    }
}