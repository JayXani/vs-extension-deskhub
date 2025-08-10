import { RequestsValidatorsController } from "../Controller/RequestsValidatorsController";
import { MaestroRootEmptyError } from "../Errors/MaestroRootEmptyError";
import { promptConfirmMerge } from "../utils/prompts";
import { searchMaestroInFolder } from "../utils/searchMaestroInFolder";
import { showMessage } from "../utils/showMessage";

export class MaestroMergeService {
    async run(workspacePath: string, vscode: any) {
        const validatorController = new RequestsValidatorsController();
        try {
            const confirmMerge: string = await promptConfirmMerge(vscode);
            if (!confirmMerge || confirmMerge.toLowerCase().startsWith("n")) { return showMessage("information", "Merge cancelado !", vscode); }
            showMessage("information", "Aguarde enquanto realizamos a busca pelas pastas...", vscode);
            const maestrosFound = searchMaestroInFolder("MAESTRO", workspacePath);

            if (!maestrosFound.success) { throw new MaestroRootEmptyError(maestrosFound.message); }

        } catch (error) {
            return showMessage("error", error.message, vscode);
        }

    }
}