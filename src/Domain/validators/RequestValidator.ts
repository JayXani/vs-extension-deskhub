import { IDataRequest } from "../types/IDataRequest";
import { IValidatorProcess } from "../types/IValidatorProcess";
import { messages } from "../../Shared/constants/messages";

export class RequestValidator implements IValidatorProcess {
    process(data: IDataRequest) {
        if (!data.authorizationToken) {
            return {
                success: false,
                message: messages.errors.http_token_cannot_be_empty
            };
        }
        return {
            success: true,
            message: messages.success.validation_request
        };
    }

}

