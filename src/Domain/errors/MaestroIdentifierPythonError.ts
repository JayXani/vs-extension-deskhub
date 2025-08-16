import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { GeneralError } from "./GeneralError";

export class MaestroIdentifierPythonError extends GeneralError {
    constructor(message: string) {
        super({
            type: "MaestroIdentifierPythonError",
            message: message,
            code: ErrorCodes.MAESTRO_IDENTIFIER_PYTHON_ERROR,
        });
    }
}