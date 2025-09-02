import { formatErrorResponse } from "../../Domain/errors/formatErrorResponse";
import { getTreeHtml } from "../../Infra/maestro/getTreeHTML";
import { VSCodePrompts } from "../../Infra/prompts/VSCodePrompts";
import { showMessage } from "../../Shared/ui/showMessage";
import { MaestroConstructorFlowService } from "../Services/MaestroConstructorFlowService";

export class MaestroConstructorFlowController {
    constructor(private vscode: any){}
    async execute(workspacePath: string){
        try {
            const service = new MaestroConstructorFlowService(this.vscode, new VSCodePrompts(this.vscode));
            const result = await service.run(workspacePath);
            const panel = this.vscode.window.createWebviewPanel( // Essa função permite criar uma tela de visualizacao com base em um HTML
                'folderTree',
                'Árvore de Pastas', // Nome do arquivo que será aberto
                this.vscode.ViewColumn.One,
                {
                    enableScripts: true // Habilita que o HTML rode scripts
                }
            );
            const html = getTreeHtml(result);
            panel.webview.html = html;
            return showMessage("information", result.message, this.vscode);
        } catch(e) {
            const errorFormatted = formatErrorResponse(e);
            return showMessage("error", errorFormatted.error.message, this.vscode);
        }
    }
}