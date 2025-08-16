import { messagesV2 } from "../../Shared/constants/messages-v2";
import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { GeneralError } from "./GeneralError";

export function formatErrorResponse(error: any) {
    if (error instanceof GeneralError) { return { error: { ...error } }; }
    return {
        // Se o que recebermos for um erro não mapeado, retornamos um erro default
        error: {
            type: "ErrorNotMapped",
            code: ErrorCodes.NOT_ASSOCIATED,
            stackTrace: error?.stack || "", // pega a linha e arquivo do erro
            message: messagesV2.errors[ErrorCodes.NOT_ASSOCIATED].replace("{code}", ErrorCodes.NOT_ASSOCIATED).replace("{type}", "ErrorNotMapped")
        }
    };
}