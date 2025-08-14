import { showMessage } from '../../Shared/ui/showMessage';
import { MaestroUploadService } from '../Services/MaestroUploadService';
import { formatErrorResponse } from '../../Domain/errors/formatErrorResponse';
import { VSCodePrompts } from '../../Infra/prompts/VSCodePrompts';

export class MaestroUpdateController {
    constructor(private vscode: any) {}
    async execute(workspacePath: string) {
        try {
            // Separa a lógica da controller utilizando a service
            const maestroUpdateService = new MaestroUploadService(this.vscode, new VSCodePrompts(this.vscode));
            const result = await maestroUpdateService.run(workspacePath);
            
            if ("error" in result) {
                return showMessage("error", result.error.message, this.vscode);
            }
            return showMessage("information", "Sucesso ! Maestro atualizado.", this.vscode);

        } catch (e) {
            const errorFormatted = formatErrorResponse(e);
            return showMessage("error", errorFormatted.error.message, this.vscode);
        }
    }
}