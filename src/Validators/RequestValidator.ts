import { IDataRequest } from "../interfaces/IDataRequest";
import { IValidatorProcess } from "../interfaces/IValidatorProcess";
import { messages } from "../utils/messages";

export class RequestValidator implements IValidatorProcess {
    process(data: IDataRequest) {
        const urlObj = new URL(data.url);
        if (data.url.trim() === "") {
            return {
                success: false,
                message: messages.errors.http_url_cannot_be_empty
            };
        }
        if (!urlObj.searchParams.get("token") && !urlObj.searchParams.get("tokentmp")) {
            return {
                success: false,
                message: messages.errors.http_format_url_invalid
            };
        }

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

