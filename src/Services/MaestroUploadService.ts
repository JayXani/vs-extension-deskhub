import { apiDeskManager } from "../api/http-request";
import { RequestsValidatorsController } from "../Controller/RequestsValidatorsController";
import { IDataRequest } from "../interfaces/IDataRequest";
import { IMaestroList, IMaestroResponse } from "../interfaces/IMaestroRequests";
import { builderMaestroJSON } from "../utils/builderMaestroJSON";
import { messages } from "../utils/messages";
import { promptGetToken, promptMaestro } from "../utils/prompts";
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
            showMessage("information", "Aguarde enquanto buscamos pelo maestro...", vscode);

            const maestrosFound = searchMaestroInFolder("MAESTRO", workspacePath);
            if (!maestrosFound.success) { return showMessage("warning", maestrosFound.message, vscode); }

            const key = await promptMaestro(maestrosFound, vscode);
            if (!key) { return showMessage('warning', messages.errors.http_maestro_not_found, vscode); }

            showMessage("information", "Maestro encontrado, realizando o upload...", vscode);
            dataRequest.bodyDownload.Chave = key;

            const maestroDesk: IMaestroResponse = await apiDeskManager("Maestro", dataRequest.bodyDownload, dataRequest.authorizationToken);
            if (!maestroDesk) { return showMessage("warning", messages.errors.http_maestro_not_found, vscode); }

            const maestroConstructor = builderMaestroJSON(maestroDesk, workspacePath);
                
            //const maestroBuilded = builderMaestroJSON()
        } catch (e) {
            return showMessage("warning", `${messages.errors.folder_exception.concat(e)}`, vscode);
        }
    }
}