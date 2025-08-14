import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { GeneralError } from "./GeneralError";

export class MaestroAlreadyExists extends GeneralError {
    constructor(message: string) {
        super({
            type: "MaestroAlreadyExists",
            message: message,
            code: ErrorCodes.MAESTRO_CONFIG_CONTENT_ERROR,
        });
    }
}