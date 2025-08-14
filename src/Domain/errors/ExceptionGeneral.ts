import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { GeneralError } from "./GeneralError";

export class ExceptionGeneral extends GeneralError {
    constructor(message: string) {
        super({
            type: "ExceptionGeneral",
            message: message,
            code: ErrorCodes.NOT_ASSOCIATED,
        });
    }
}