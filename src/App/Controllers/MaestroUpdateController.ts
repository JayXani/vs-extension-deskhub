import { showMessage } from '../../Shared/ui/showMessage';
import { MaestroUploadService } from '../Services/MaestroUploadService';
import { MaestroDomainService } from '../Services/MaestroDomainService';
import { GeneralError } from '../../Domain/errors/GeneralError';

export class MaestroUpdateController {
    constructor(private vscode: any) {}
    async execute(workspacePath: string) {
        try {
            // Separa a lógica da controller utilizando a service
            const maestroService = new MaestroDomainService(this.vscode);
            const maestroUpdateService = new MaestroUploadService(maestroService);
            const result = await maestroUpdateService.run(workspacePath);
            
            if ("error" in result) {
                const error = result.error;
                const message = error.message.replace("{type}", error.type).replace("{code}", error.code);
                return showMessage("error", message, this.vscode);
            }
            return showMessage("information", "Sucesso ! Maestro atualizado.", this.vscode);

        } catch (e) {
            if(e instanceof GeneralError){
                const message = e.message
                .replace("{type}", e.type)
                .replace("{code}", e.code);
                return showMessage("error", message, this.vscode);
            }
            return showMessage("error", e.message, this.vscode);
        }
    }
}