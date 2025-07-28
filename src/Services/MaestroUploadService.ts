import { apiDeskManager } from "../api/http-request";
import { RequestsValidatorsController } from "../Controller/RequestsValidatorsController";
import { IDataRequest } from "../interfaces/IDataRequest";
import { builderMaestroJSON } from "../utils/builderMaestroJSON";
import { messages } from "../utils/messages";
import { promptGetKey, promptGetToken } from "../utils/prompts";
import { searchMaestroInFolder } from "../utils/searchMaestroInFolder";
import { showMessage } from "../utils/showMessage";

export class MaestroUploadService {
    async run(workspacePath: string, vscode: any) {
        try {
            const validator = new RequestsValidatorsController();
            const token = await promptGetToken(vscode);
            const dataRequest: IDataRequest = {
                authorizationToken: token,
                url: "",
                bodyList: {
                    Pesquisa: "",
                    Tudo: "true",
                    Ativo: "1"
                },
                bodyDownload: {
                    Chave: ""
                }
            };
            const informationMaestroValidated = await validator.valid("init", dataRequest);
            if (!informationMaestroValidated.success) {
                return showMessage("warning", informationMaestroValidated.message, vscode);
            }
            const keyMaestro = await promptGetKey(vscode);
            showMessage("information", "Aguarde enquanto buscamos pelo maestro...", vscode);

            const maestroFound = searchMaestroInFolder(keyMaestro, workspacePath);

            if (!maestroFound.success) {
                showMessage("warning", maestroFound.message, vscode);
                return;
            }
            showMessage("information", "Maestro encontrado, realizando o upload...", vscode);
            dataRequest.bodyDownload.Chave = keyMaestro;

            const searchMaestroInDesk = await apiDeskManager("Maestro", dataRequest.bodyDownload, dataRequest.authorizationToken);
            if (!searchMaestroInDesk) {
                showMessage("warning", messages.errors.http_maestro_not_found, vscode);
                return;
            }
            //const maestroConverted = builderMaestroJSON(maestroFound.path);


        } catch (e) {
            return showMessage("warning", `${messages.errors.folder_exception.concat(e)}`, vscode);
        }
    }
}