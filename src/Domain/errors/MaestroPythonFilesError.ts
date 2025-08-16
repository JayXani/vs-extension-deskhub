import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { GeneralError } from "./GeneralError";

export class MaestroPythonFilesError extends GeneralError {
    constructor(message: string) {
        super({
            type: "MaestroPythonFilesError",
            message: message,
            code: ErrorCodes.MAESTRO_NOT_FOUND_ERROR,
        });
    }
}