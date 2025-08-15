import { IMaestroResponse } from "../types/IMaestroRequests";
import { IValidatorProcess } from "../types/IValidatorProcess";
import { messagesV2 } from "../../Shared/constants/messages-v2";
import { MaestroBase64IsNotString } from "../errors/MaestroBase64IsNotString";
import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { SuccessCodes } from "../../Shared/constants/SuccessCodes";

export class Base64Validator implements IValidatorProcess {
    process(maestroResponse: IMaestroResponse): { success: boolean; message: string; } {
        
        const regexBase64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
        if (!maestroResponse.TMaestro.Fluxo || typeof maestroResponse.TMaestro.Fluxo !== "string") {
            throw new MaestroBase64IsNotString(messagesV2.errors[ErrorCodes.MAESTRO_BASE64_IS_NOT_STRING]);
        }
        if (!regexBase64.test(maestroResponse.TMaestro.Fluxo)) {
            throw new MaestroBase64IsNotString(messagesV2.errors[ErrorCodes.MAESTRO_BASE64_IS_NOT_STRING]);
        }
        return {
            success: true,
            message: messagesV2.success[SuccessCodes.SUCCESS_DATA_REQUEST_VALID]
        };
    }
}