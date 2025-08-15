import { FileRenameEvent } from 'vscode';
import { formatErrorResponse } from '../../Domain/errors/formatErrorResponse';
import { VSCodePrompts } from '../../Infra/prompts/VSCodePrompts';
import { showMessage } from '../../Shared/ui/showMessage';
import { MaestroListenerService } from '../Services/MaestroListenerService';

export class MaestroListenerController {
    constructor(private vscode: any) { }
    async execute(event: FileRenameEvent) {
        try {
            const maestroListenerService = new MaestroListenerService(this.vscode, new VSCodePrompts(this.vscode));
            const result = await maestroListenerService.run(event);
            if ("error" in result) { return showMessage("error", result.error.message, this.vscode); }
            return showMessage("information", result.message, this.vscode);
        } catch (e) {
            const errorFormatted = formatErrorResponse(e);
            return showMessage("error", errorFormatted.error.message, this.vscode);
        }
    }
}