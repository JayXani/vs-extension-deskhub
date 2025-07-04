import { IDataRequest } from "../interfaces/IDataRequest";
import { IValidatorProcess } from "../interfaces/IValidatorProcess";
import { messages } from "../utils/messages";

export class URLValidator implements IValidatorProcess {
    process(data: IDataRequest) {
        if (data.url.trim() === "") {
            return {
                success: false,
                message: messages.errors.http_url_cannot_be_empty
            };
        }
        if (!/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(data.url)) {
            return {
                success: false,
                message: messages.errors.http_format_url_invalid
            };
        }
        return {
            success: false,
            message: messages.success.validation_request
        };
    }

}