import * as os from 'os';
import * as path from 'path';
import { IMaestroConfig } from '../../Domain/types/IMaestroConfig';
import { IDataRequestKey } from '../../Domain/types/IDataRequest';
import { MaestroValidatorService } from './MaestroValidatorService';
import { saveMaestroConfig } from '../../Infra/maestro/maestroFileWritterConfig';
import { extractPrefixFromUrl } from '../../Infra/maestro/getPrefixo';
import { showMessage } from '../../Shared/ui/showMessage';
import { createMaestroFilesPy } from '../../Infra/maestro/createMaestroFilesPy';
import { apiDeskManager } from '../../Infra/api/http-request';
import { MaestroDomainService } from './MaestroDomainService';
import { IPrompts } from '../../Domain/types/IPrompts';
import { messagesV2 } from '../../Shared/constants/messages-v2';
import { SuccessCodes } from '../../Shared/constants/SuccessCodes';

export class MaestroInitService extends MaestroDomainService {
    constructor(vscode: any, prompts: IPrompts) {
        super(vscode, prompts);
    }
    async run(workspacePath: string) {

        const validatorController = new MaestroValidatorService();
        const publicKey = await this.getPrompts().promptPublicKey();
        const apiKey = await this.getPrompts().promptApiKey();
        const token = await apiDeskManager("Login/autenticar", { PublicKey: publicKey }, apiKey);

        const dataRequest: IDataRequestKey = {
            authorizationToken: token,
            body: {
                Chave: ""
            }
        };
        await validatorController.valid("init", dataRequest);
        showMessage("information", "Aguarde enquanto realizamos a busca na lista de maestros...", this.getVscode());

        const maestroList = await this.loadMaestroList(token);
        const maestroChoice = await this.loadMaestroChoose(maestroList, token);
        showMessage("information", "Aguarde enquanto buscamos pelo seu maestro...", this.getVscode());


        const config: IMaestroConfig = {
            name: maestroChoice.TMaestro.Nome,
            key: maestroChoice.TMaestro.Chave,
            prefixo: extractPrefixFromUrl(maestroChoice.TMaestro.Token),
            author: os.hostname(),
            urlPost: maestroChoice.TMaestro.Token,
            urlGet: maestroChoice.TMaestro.TokenGet,
            token_email: maestroChoice.TMaestro.TokenEmail,
            publicKey: publicKey,
            apiKey: apiKey,
            pathMaestro: "",
            description: maestroChoice.TMaestro.Descricao,
            constants: [],
            cron: [],
            autoBuilded: false,
            files: maestroChoice.TFiles.map((f) => f),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        const filesCreated = await createMaestroFilesPy(workspacePath, maestroChoice);
        const configPath = path.join(filesCreated.path, 'maestro.config.json'); // Cria o arquivo dentro do próprio diretório do maestro.

        config.pathMaestro = filesCreated.path;
        config.constants = filesCreated.constants;
        config.cron = filesCreated.cron;

        saveMaestroConfig(configPath, config);
        return {
            success: true,
            message: messagesV2.success[SuccessCodes.SUCCESS_CONFIG_SAVED]
        };
    }
}
