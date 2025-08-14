import { IDataRequest } from "../types/IDataRequest";
import { IValidatorProcess } from "../types/IValidatorProcess";
import { messagesV2 } from "../../Shared/constants/messages-v2";
import { MaestroTokenNotFoundError } from "../errors/MaestroTokenNotFoundError";
import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { SuccessCodes } from "../../Shared/constants/SuccessCodes";

export class RequestValidator implements IValidatorProcess {
    process(data: IDataRequest) {
        if (!data.authorizationToken) { 
            throw new MaestroTokenNotFoundError(messagesV2.errors[ErrorCodes.MAESTRO_TOKEN_EMPTY_ERROR]);
        }
        return {
            success: true,
            message: messagesV2.success[SuccessCodes.SUCCESS_DATA_REQUEST_VALID]
        };
    }

}

