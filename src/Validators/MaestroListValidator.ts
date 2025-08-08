import { IMaestroList } from "../interfaces/IMaestroRequests";
import { IValidatorProcess } from "../interfaces/IValidatorProcess";
import { messages } from "../utils/messages";

export class MaestroListValidator implements IValidatorProcess {
    process(maestroList: IMaestroList): { success: boolean; message: string; } {
        if ("erro" in maestroList) {
            return {
                success: false,
                message: messages.errors.http_maestro_response_error.concat(maestroList.erro as string)
            };
        }
        if (!maestroList.root.length) {
            return {
                success: false,
                message: messages.errors.http_maestro_not_found
            };
        }
        return {
            success: true,
            message: messages.success.maestros_found
        };
    }
}