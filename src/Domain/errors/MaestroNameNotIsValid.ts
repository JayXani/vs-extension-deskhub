import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { GeneralError } from "./GeneralError";

export class MaestroNameNotIsValid extends GeneralError {
    constructor(message: string) {
        super({
            type: "MaestroNameNotIsValid",
            message: message,
            code: ErrorCodes.MAESTRO_NAME_NOT_IS_VALID,
        });
    }
}