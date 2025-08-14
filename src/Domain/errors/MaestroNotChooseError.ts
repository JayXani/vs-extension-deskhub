import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { GeneralError } from "./GeneralError";

export class MaestroNotChooseError extends GeneralError {
    constructor(message: string) {
        super({
            type: "MaestroNotChooseError",
            message: message,
            code: ErrorCodes.MAESTRO_NOT_CHOOSE_ERROR,
        });
    }
}