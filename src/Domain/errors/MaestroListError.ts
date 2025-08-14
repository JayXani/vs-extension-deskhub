import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { GeneralError } from "./GeneralError";

export class MaestroListError extends GeneralError {
    constructor(message: string) {
        super({
            type: "MaestroListError",
            message: message,
            code: ErrorCodes.MAESTRO_LIST_ERROR,
        });
    }
}