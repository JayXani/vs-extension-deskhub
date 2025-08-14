import { formatErrorResponse } from '../../Domain/errors/formatErrorResponse';
import { VSCodePrompts } from '../../Infra/prompts/VSCodePrompts';
import { showMessage } from '../../Shared/ui/showMessage';
import { MaestroInitService } from '../Services/MaestroInitService';

export class MaestroInitController {
    constructor(private vscode: any){}
    async execute(workspacePath: string) {
        try {
            const maestroInitService = new MaestroInitService(this.vscode, new VSCodePrompts(this.vscode));
            const result = await maestroInitService.run(workspacePath);
            return showMessage("information", result.message, this.vscode);
        } catch (e) {
            const errorFormatted = formatErrorResponse(e);
            return showMessage("error", errorFormatted.error.message, this.vscode);
        }
    }
}