import { formatErrorResponse } from '../../Domain/errors/formatErrorResponse';
import { showMessage } from '../../Shared/ui/showMessage';

export class MaestroBackupController {
    private vscode: typeof import('vscode') | boolean;

    constructor(vscode: typeof import('vscode') | boolean) {
        this.vscode = vscode;
    }

    public async execute(workspacePath: string): Promise<void> {
        try {
            // Simulate backup logic
        } catch (e) {
            const error = formatErrorResponse(e);
            return showMessage("error", error.error.message, this.vscode);
        }
    }
}