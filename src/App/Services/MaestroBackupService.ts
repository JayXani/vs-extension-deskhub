import { IPrompts } from '../../Domain/types/IPrompts';
import { VSCodePrompts } from '../../Infra/prompts/VSCodePrompts';
import { MaestroDomainService } from './MaestroDomainService';

export class MaestroBackupService extends MaestroDomainService{
    constructor(
        vscode: typeof import('vscode') | boolean,
        prompts: IPrompts
    ){ 
        super(vscode, prompts);
    }
    async run(workspacePath: string){

    }
}