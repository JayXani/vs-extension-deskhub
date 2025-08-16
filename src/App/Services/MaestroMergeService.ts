import { showMessage } from "../../Shared/ui/showMessage";
import { VSCodePrompts } from "../../Infra/prompts/VSCodePrompts";
import { messagesV2 } from "../../Shared/constants/messages-v2";
import { MaestroDomainService } from "./MaestroDomainService";
import { SuccessCodes } from "../../Shared/constants/SuccessCodes";
import { apiDeskManager } from "../../Infra/api/http-request";
import { IMaestroFile, IMaestroTree } from "../../Domain/types/IMaestroFile";
import { createFiles } from "../../Infra/maestro/createMaestroFilesPy";

export class MaestroMergeService extends MaestroDomainService {
    constructor(vscode: any, vscodePrompts: VSCodePrompts) {
        super(vscode, vscodePrompts);
    }
    async run(workspacePath: string) {
        showMessage("information", "Aguarde enquanto realizamos a busca pelas pastas...", this.getVscode());

        const maestroChoose = await this.getMaestroPath(workspacePath);
        const configJson = this.loadMaestroConfig(maestroChoose);

        const tokenMaestro = await apiDeskManager("Login/autenticar", { PublicKey: configJson.publicKey }, configJson.apiKey);
        const maestroDMDownloaded = await this.downloadMaestroDM(maestroChoose, tokenMaestro);
        const maestroFlowJson = JSON.parse(maestroDMDownloaded.TMaestro.Fluxo) as IMaestroFile;

        // O flowBuilder irá pegar todo o conteúdo do maestro recebido via API, realizar o download alterar o conteúdo
        // do parse que corresponder com o que está localmente, portanto, as alterações do VSCode permanecerão
        // E o download só será realizado dos itens que estão no maestro.
        const tree = maestroFlowJson.tree.split(";").map((v) => v.split("."));
        if (typeof maestroFlowJson.config === "string") {
            maestroFlowJson.config = JSON.parse(maestroFlowJson.config);
        }
        const maestroConfig = maestroFlowJson.config as IMaestroTree[];
        const configMap = new Map<string, IMaestroTree>();
        maestroConfig.forEach((cfg) => configMap.set(cfg.name.replace("PARSE_", "").trim(), cfg));
        createFiles(maestroChoose.path, tree, configMap);

        return {
            success: true,
            message: messagesV2.success[SuccessCodes.SUCCESS_MERGE]
        };
    }
}