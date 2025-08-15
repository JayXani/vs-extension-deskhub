import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { GeneralError } from "./GeneralError";

export class MaestroCannotBeUpdate extends GeneralError {
    constructor(message: string) {
        super({
            type: "MaestroCannotBeUpdate",
            message: message,
            code: ErrorCodes.MAESTRO_NOT_UPDATE,
        });
    }
}