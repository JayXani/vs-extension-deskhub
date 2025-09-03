import { IPrompts } from '../../Domain/types/IPrompts';

export class VSCodePrompts implements IPrompts {
    constructor(private vscode: any) { }
    async promptGetToken(): Promise<string | undefined> {

        return this.vscode.window.showInputBox({
            prompt: "Informe o token temporário de autenticação:",
            ignoreFocusOut: false
        });
    }


    async promptMaestro(maestroList: any,) {

        const quickPickItems = maestroList.root.map(item => ({
            label: item.Nome,
            description: `Chave interna: ${item.Chave}`,
            key: item.Chave
        }));
        return this.vscode.window.showQuickPick(quickPickItems, {
            placeHolder: 'Escolha um Maestro para configurar'
        });

    }

    async promptGetKey() {

        return this.vscode.window.showInputBox({
            prompt: "Informe a chave do maestro que deseja realizar o upload:",
            ignoreFocusOut: false
        });

    }

    async promptPublicKey() {

        return this.vscode.window.showInputBox({
            prompt: "Informe a chave do ambiente:",
            ignoreFocusOut: true,
        });


    }
    async promptApiKey() {

        return this.vscode.window.showInputBox({
            prompt: "Informe a chave do operador:",
            ignoreFocusOut: true,
        });


    }

    //NÃO UTILIZADO, MANTER COMO TEMPLATE POR ENQUANTO
    async promptConfirmMerge() {

        return this.vscode.window.showWarningMessage(
            "ATENÇÃO !\n\nInformamos que o merge prioriza os dados do maestro, portanto, se o código atual no maestro estiver desatualizado, os parses no vscode também estarão desatualizados.\nÉ importante que realize o upload antes de realizar o merge, ou marque a opção autoBuilded como true dentro do maestro.config, para realizar o upload automático.\n\nVocê confirma o merge ?",
            { modal: true },
            "Sim",
            "Não"
        );

    }
}