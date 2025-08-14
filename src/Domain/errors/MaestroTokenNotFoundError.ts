import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { GeneralError } from "./GeneralError";

export class MaestroTokenNotFoundError extends GeneralError {
    constructor(message: string) {
        super({
            type: "MaestroTokenNotFoundError",
            message: message,
            code: ErrorCodes.MAESTRO_TOKEN_EMPTY_ERROR,
        });
    }
}