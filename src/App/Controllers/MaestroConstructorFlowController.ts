import { formatErrorResponse } from "../../Domain/errors/formatErrorResponse";
import { getTreeHtml } from "../../Infra/maestro/getTreeHTML";
import { VSCodePrompts } from "../../Infra/prompts/VSCodePrompts";
import { showMessage } from "../../Shared/ui/showMessage";
import { MaestroConstructorFlowService } from "../Services/MaestroConstructorFlowService";
import * as vscode from 'vscode';
export class MaestroConstructorFlowController {
    constructor() { }
    async execute(uri: vscode.Uri) {
        try {
            const service = new MaestroConstructorFlowService(vscode, new VSCodePrompts(vscode));
            const result = await service.run(uri.fsPath);
            const panel = vscode.window.createWebviewPanel( // Essa função permite criar uma tela de visualizacao com base em um HTML
                'folderTree',
                'Árvore de Pastas', // Nome do arquivo que será aberto
                vscode.ViewColumn.One,
                {
                    enableScripts: true // Habilita que o HTML rode scripts
                }
            );
            if ("error" in result && typeof result.error === "object" && "message" in result.error) {
                return showMessage("error", (result.error as { message: string }).message, vscode);
            }

            const cspSource = panel.webview.cspSource;

            //Acessa os scripts de forma segura, permite que os scripts sejam acessados somente localmente
            const scriptUri = panel.webview.asWebviewUri(
                vscode.Uri.joinPath(uri, "Shared", "ui", "LocalBundleJs", "scripts", "script_maestro.js")
            );

            const html = getTreeHtml(result, cspSource, scriptUri);
            panel.webview.html = html;
            panel.webview.onDidReceiveMessage((message) => {
                if (typeof message !== "object" && !message.type) { return; }
                if (message.type === "save-maestro"){}
            });
            return showMessage("information", result.message, vscode);

        } catch (e) {
            const errorFormatted = formatErrorResponse(e);
            return showMessage("error", errorFormatted.error.message, vscode);
        }
    }
}