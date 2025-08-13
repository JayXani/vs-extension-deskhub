

import {messagesV2 } from "../../Shared/constants/messages-v2";
import { showMessage } from "../../Shared/ui/showMessage";
import { IMaestroFile } from "../../Domain/types/IMaestroFile";
import { MaestroFileChoose } from '../../Domain/types/MaestroFileChoose';
import { MaestroDomainService } from "./MaestroDomainService";
import { apiDeskManager } from "../../Infra/api/http-request";
import { GeneralError } from "../../Domain/errors/GeneralError";
import { ErrorCodes } from "../../Domain/errors/ErrorCodes";
import { ExceptionGeneral } from "../../Domain/errors/ExceptionGeneral";

export class MaestroUploadService {
    constructor(private maestroService: MaestroDomainService) { }
    async run(workspacePath: string) {
        try {

            showMessage("information", "Aguarde enquanto carregamos os maestros...", this.maestroService.getVscode());

            const maestroFileChoose: MaestroFileChoose = await this.maestroService.getMaestroPath(workspacePath);
            const maestroFileConfig = this.maestroService.loadMaestroConfig(maestroFileChoose);
            const tokenMaestro = await apiDeskManager("Login/autenticar", { PublicKey: maestroFileConfig.publicKey }, maestroFileConfig.apiKey);
            const maestroDownloaded = await this.maestroService.downloadMaestroDM(maestroFileChoose, tokenMaestro);

            const maestroConfigJson: IMaestroFile = JSON.parse(maestroDownloaded.TMaestro.Fluxo);
            if (typeof maestroConfigJson.config === "string") { maestroConfigJson.config = JSON.parse(maestroConfigJson.config); }

            const maestroBuilded = this.maestroService.builderMaestro(maestroConfigJson, maestroFileChoose, maestroDownloaded);
            const maestroUpdated = await apiDeskManager("Maestro", maestroBuilded, tokenMaestro, "application/json", "PUT");

            // Lançamos a excessão para a controller tratar
            if ("erro" in maestroUpdated) { throw new ExceptionGeneral(messagesV2.errors[ErrorCodes.NOT_ASSOCIATED]); }

            return { success: true};
            
        } catch (e) {
            if (e instanceof GeneralError) { return { error: {...e} }; }
            // Retorno de segurança caso algum erro passe despercebido
            return {
                error: {
                    type: "ERROR",
                    code: ErrorCodes.NOT_ASSOCIATED,
                    message: messagesV2.errors[ErrorCodes.NOT_ASSOCIATED]
                }
            };
        }
    }

}
