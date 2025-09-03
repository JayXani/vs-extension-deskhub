import { showMessage } from "../../Shared/ui/showMessage";
import { MaestroDomainService } from "./MaestroDomainService";
import { messagesV2 } from "../../Shared/constants/messages-v2";
import { SuccessCodes } from "../../Shared/constants/SuccessCodes";
import { securityNonce } from "../../Shared/helpers/security";
import { apiDeskManager } from "../../Infra/api/http-request";
import { MaestroFileChoose } from "../../Domain/types/MaestroFileChoose";

export class MaestroConstructorFlowService extends MaestroDomainService {
  async run(basePath: string) {
    const nonce = securityNonce();

    const maestroFileChoose: MaestroFileChoose = await this.getMaestroPath(basePath);
    showMessage("information", "Aguarde enquanto carregamos os dados do fluxo...", this.getVscode());
    const maestroFileConfig = this.loadMaestroConfig(maestroFileChoose);
    const tokenMaestro = await apiDeskManager("Login/autenticar", { PublicKey: maestroFileConfig.publicKey }, maestroFileConfig.apiKey);
    const maestroDownloaded = await this.downloadMaestroDM(maestroFileChoose, tokenMaestro);
    const maestroFlowJson = this.convertFlowMaestro(maestroDownloaded.TMaestro.Fluxo);

    return {
      success: true,
      nonce: nonce,
      tree: maestroFlowJson.tree,
      config: maestroFlowJson.config,
      operatorKey:  maestroFileConfig.apiKey,
      apiKey:  maestroFileConfig.publicKey,
      message: messagesV2.success[SuccessCodes.SUCCESS_TREE_GENERATE]
    };
  }
}