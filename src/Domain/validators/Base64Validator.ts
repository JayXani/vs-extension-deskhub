import { IMaestroResponse } from "../types/IMaestroRequests";
import { IValidatorProcess } from "../types/IValidatorProcess";
import { messages } from "../../Shared/constants/messages";

export class Base64Validator implements IValidatorProcess {
    process(maestroResponse: IMaestroResponse): { success: boolean; message: string; } {
        try {
            const regexBase64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
            if (!maestroResponse.TMaestro.Fluxo || typeof maestroResponse.TMaestro.Fluxo !== "string") {
                return {
                    success: false,
                    message: messages.errors.string_is_not_base64
                };
            }
            if (!regexBase64.test(maestroResponse.TMaestro.Fluxo)) {
                return {
                    success: false,
                    message: messages.errors.string_is_not_base64
                };
            }
            return {
                success: true,
                message: messages.success.validation_request
            };
        } catch (e) {
            return {
                success: false,
                message: messages.errors.http_maestro_response_error.concat(e)
            };
        }
    }
}