import { MaestroValidatorService } from "./MaestroValidatorService";
import { searchMaestroInFolder } from "../../Infra/maestro/searchMaestroInFolder";
import { showMessage } from "../../Shared/ui/showMessage";
import { VSCodePrompts } from "../../Infra/prompts/VSCodePrompts";
import { MaestroRootEmptyError } from "../../Domain/errors/MaestroRootEmptyError";
import { messages } from "../../Shared/constants/messages";
import { ErrorCodes } from "../../Domain/errors/ErrorCodes";

export class MaestroMergeService {
    constructor(private vscode: any) { }
    async run(workspacePath: string) {
        const validatorController = new MaestroValidatorService();
        const vscodePrompts = new VSCodePrompts(this.vscode);

        try {
            const confirmMerge: string = await vscodePrompts.promptConfirmMerge();
            if (!confirmMerge || confirmMerge.toLowerCase().startsWith("n")) { return showMessage("information", "Merge cancelado !", this.vscode); }
            showMessage("information", "Aguarde enquanto realizamos a busca pelas pastas...", this.vscode);
            const maestrosFound = searchMaestroInFolder("MAESTRO", workspacePath);

            if (!maestrosFound.success) { throw new MaestroRootEmptyError(messages.errors[ErrorCodes.MAESTRO_ROOT_EMPTY_ERROR]); }

        } catch (error) {
            return showMessage("error", error.message, this.vscode);
        }

    }
}