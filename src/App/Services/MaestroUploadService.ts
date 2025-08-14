

import { messagesV2 } from "../../Shared/constants/messages-v2";
import { showMessage } from "../../Shared/ui/showMessage";
import { IMaestroFile } from "../../Domain/types/IMaestroFile";
import { MaestroFileChoose } from '../../Domain/types/MaestroFileChoose';
import { MaestroDomainService } from "./MaestroDomainService";
import { apiDeskManager } from "../../Infra/api/http-request";
import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { ExceptionGeneral } from "../../Domain/errors/ExceptionGeneral";
import { formatErrorResponse } from "../../Domain/errors/formatErrorResponse";
import { SuccessCodes } from "../../Shared/constants/SuccessCodes";
import { IPrompts } from "../../Domain/types/IPrompts";

export class MaestroUploadService extends MaestroDomainService {
    constructor(vscode: any, prompts: IPrompts) {
        super(vscode, prompts);
    }
    async run(workspacePath: string) {
        try {

            showMessage("information", "Aguarde enquanto carregamos os maestros...", this.getVscode());

            const maestroFileChoose: MaestroFileChoose = await this.getMaestroPath(workspacePath);
            const maestroFileConfig = this.loadMaestroConfig(maestroFileChoose);
            const tokenMaestro = await apiDeskManager("Login/autenticar", { PublicKey: maestroFileConfig.publicKey }, maestroFileConfig.apiKey);
            const maestroDownloaded = await this.downloadMaestroDM(maestroFileChoose, tokenMaestro);

            const maestroConfigJson: IMaestroFile = JSON.parse(maestroDownloaded.TMaestro.Fluxo);
            if (typeof maestroConfigJson.config === "string") { maestroConfigJson.config = JSON.parse(maestroConfigJson.config); }

            const maestroBuilded = this.builderMaestro(maestroConfigJson, maestroFileChoose, maestroDownloaded);
            const maestroUpdated = await apiDeskManager("Maestro", maestroBuilded, tokenMaestro, "application/json", "PUT");

            // Lançamos a excessão para a controller tratar, caso os erros encontrados durante o processamento, não tenham sido mapeados
            // Caso os erros tenham sido mapeados corretamente, qualquer erro será enviado para a controller.
            if ("erro" in maestroUpdated) { throw new ExceptionGeneral(messagesV2.errors[ErrorCodes.NOT_ASSOCIATED]); }

            return { 
                success: true,
                message: messagesV2.success[SuccessCodes.SUCCESS_UPLOAD]
            };

        } catch (e) {
            return formatErrorResponse(e);
        }
    }

}
