import { formatErrorResponse } from "../../Domain/errors/formatErrorResponse";
import { VSCodePrompts } from "../../Infra/prompts/VSCodePrompts";
import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { messagesV2 } from "../../Shared/constants/messages-v2";
import { showMessage } from "../../Shared/ui/showMessage";
import { MaestroMergeService } from "../Services/MaestroMergeService";

export class MaestroMergeController {
    constructor(private vscode: any) { }
    async execute(workspacePath: string) {
        try {
            const maestroMergeService = new MaestroMergeService(this.vscode, new VSCodePrompts(this.vscode));
            const result = await maestroMergeService.run(workspacePath);

            if ("error" in result) { throw new Error(messagesV2.errors[ErrorCodes.NOT_ASSOCIATED]); }
            return showMessage("information", result.message, this.vscode);
        } catch (e) {  
            const errorFormatted = formatErrorResponse(e);
            console.log(errorFormatted);
            return showMessage("error", errorFormatted.error.message, this.vscode);
        }
    }
}