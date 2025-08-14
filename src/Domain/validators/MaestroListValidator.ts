import { IMaestroList } from "../types/IMaestroRequests";
import { IValidatorProcess } from "../types/IValidatorProcess";
import { messagesV2 } from "../../Shared/constants/messages-v2";
import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { SuccessCodes } from "../../Shared/constants/SuccessCodes";
import { MaestroListError } from "../errors/MaestroListError";
import { MaestroRootEmptyError } from "../errors/MaestroRootEmptyError";
export class MaestroListValidator implements IValidatorProcess {
    process(maestroList: IMaestroList): { success: boolean; message: string; } {
        if ("erro" in maestroList) { throw new MaestroListError(messagesV2.errors[ErrorCodes.MAESTRO_LIST_ERROR]); }
        if (!maestroList.root.length) { throw new MaestroRootEmptyError(messagesV2.errors[ErrorCodes.MAESTRO_NOT_FOUND_ERROR]); }
        return {
            success: true,
            message: messagesV2.success[SuccessCodes.SUCCESS_MAESTROS_FOUND]
        };
    }
}