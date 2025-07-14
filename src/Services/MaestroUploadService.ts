import { RequestsValidatorsController } from "../Controller/RequestsValidatorsController";
import { IDataRequest } from "../interfaces/IDataRequest";
import { messages } from "../utils/messages";
import { promptGetKey, promptGetToken } from "../utils/prompts";
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
        } catch (e) {
            return showMessage("warning", `${messages.errors.folder_exception.concat(e)}`, vscode);
        }
    }
}