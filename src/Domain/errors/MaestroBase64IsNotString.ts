import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { GeneralError } from "./GeneralError";

export class MaestroBase64IsNotString extends GeneralError {
    constructor(message: string) {
        super({
            type: "MaestroBase64IsNotString",
            message: message,
            code: ErrorCodes.MAESTRO_BASE64_IS_NOT_STRING,
        });
    }
}