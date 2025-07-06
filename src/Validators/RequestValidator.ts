import { IDataRequest } from "../interfaces/IDataRequest";
import { IValidatorProcess } from "../interfaces/IValidatorProcess";
import { messages } from "../utils/messages";

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

