import * as os from 'os';
import * as path from 'path';
import { IMaestroConfig } from '../../Domain/types/IMaestroConfig';
import { IDataRequest } from '../../Domain/types/IDataRequest';
import { MaestroValidatorService } from './MaestroValidatorService';
import { saveMaestroConfig } from '../../Infra/maestro/maestroFileWritterConfig';
import { extractPrefixFromUrl } from '../../Infra/maestro/getPrefixo';
import { IMaestroResponse, IMaestroList } from '../../Domain/types/IMaestroRequests';
import { showMessage } from '../../Shared/ui/showMessage';
import { createMaestroFilesPy } from '../../Infra/maestro/createMaestroFilesPy';
import { messages } from '../../Shared/constants/messages';
import { apiDeskManager } from '../../Infra/api/http-request';
import { VSCodePrompts } from '../../Infra/prompts/VSCodePrompts';

export class MaestroInitService {
    async run(workspacePath: string, vscode: any) {
        try {
            const vscodePrompts = new VSCodePrompts(vscode);
            const validatorController = new MaestroValidatorService();
            const publicKey = await vscodePrompts.promptPublicKey();
            const apiKey = await vscodePrompts.promptApiKey();
            const token = await apiDeskManager("Login/autenticar", { PublicKey: publicKey }, apiKey);

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
            const validation = await validatorController.valid("init", dataRequest);
            if (!validation.success) { return showMessage("warning", validation.message, vscode); }
            showMessage("information", "Aguarde enquanto realizamos a busca na lista de maestros...", vscode);

            const maestroList: IMaestroList = await apiDeskManager("Maestro/lista", dataRequest.bodyList, dataRequest.authorizationToken);
            const validationMaestroList = await validatorController.valid('maestrolist', maestroList);
            if (!validationMaestroList.success) { return showMessage("warning", validationMaestroList.message, vscode); }

            const maestroChoosed = await vscodePrompts.promptMaestro(maestroList);
            if (!maestroChoosed) { return showMessage("warning", "Nenhum maestro selecionado.", vscode); }

            showMessage("information", "Aguarde enquanto buscamos pelo seu maestro...", vscode);

            dataRequest.bodyDownload.Chave = maestroChoosed.key.toString();
            const maestroChoice: IMaestroResponse = await apiDeskManager("Maestro", dataRequest.bodyDownload, dataRequest.authorizationToken);
            const validationMaestroChoice = await validatorController.valid("maestrotfile", maestroChoice);
            if (!validationMaestroChoice.success) { return showMessage("warning", validationMaestroChoice.message, vscode); }

            const config: IMaestroConfig = {
                name: maestroChoosed.label,
                key: maestroChoosed.key,
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
            if (!filesCreated.success) { return showMessage("warning", filesCreated.message, vscode); }

            const configPath = path.join(filesCreated.path, 'maestro.config.json'); // Cria o arquivo dentro do próprio diretório do maestro.

            config.pathMaestro = filesCreated.path;
            config.constants = filesCreated.constants;
            config.cron = filesCreated.cron;

            if (!saveMaestroConfig(configPath, config)) { return showMessage("warning", "O arquivo maestro.config.json já existe.", vscode); }
            showMessage("information", '✅ Arquivo maestro.config.json criado com sucesso!', vscode);
        } catch (e) {
            return showMessage("error", messages.errors.folder_exception.concat(e), vscode);
        }
    }
}
