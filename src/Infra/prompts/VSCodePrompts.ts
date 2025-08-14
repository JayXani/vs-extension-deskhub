import * as inquirer from 'inquirer';
import { IPrompts } from '../../Domain/types/IPrompts';

export class VSCodePrompts implements IPrompts {
    constructor(private vscode: any){}
    async promptGetToken(): Promise<string | undefined> {
        if (!this.vscode) {
            const prompt = inquirer.createPromptModule();

            const { token } = await prompt([
                {
                    type: 'input',
                    name: 'token',
                    message: '🔐 Digite o token de autenticação temporária:'
                }
            ]);
            return token;
        }
        return this.vscode.window.showInputBox({
            prompt: "Informe o token temporário de autenticação:",
            ignoreFocusOut: false
        });
    }


    async promptMaestro(maestroList: any, ) {
        if (this.vscode) {
            const quickPickItems = maestroList.root.map(item => ({
                label: item.Nome,
                description: `Chave interna: ${item.Chave}`,
                key: item.Chave
            }));
            return this.vscode.window.showQuickPick(quickPickItems, {
                placeHolder: 'Escolha um Maestro para configurar'
            });
        }
        const prompt = inquirer.createPromptModule();
        const { choose } = await prompt([
            {
                type: "rawlist",
                name: "choose",
                message: "🔎 Selecione o maestro desejado:",
                choices: maestroList.root.map((m: any) => ({
                    name: `${m.Nome} (${m.Chave})`, // o que o usuário vê
                    value: m.Chave                 // o que você recebe no retorno
                }))
            }
        ]);
        return {
            key: choose
        };
    }

    async promptGetKey() {
        if (this.vscode) {
            return this.vscode.window.showInputBox({
                prompt: "Informe a chave do maestro que deseja realizar o upload:",
                ignoreFocusOut: false
            });
        }
        const prompt = inquirer.createPromptModule();
        const { keyMaestro } = await prompt([
            {
                type: "input",
                name: "keyMaestro",
                message: "🔎 Informe a chave do maestro que deseja realizar o upload:"
            }
        ]);
        return keyMaestro;
    }

    async promptPublicKey() {
        if (this.vscode) {
            return this.vscode.window.showInputBox({
                prompt: "Informe a chave do ambiente:",
                ignoreFocusOut: true,
            });
        }
        const prompt = inquirer.createPromptModule();
        const { publicKey } = await prompt([
            {
                type: "input",
                name: "publicKey",
                message: "🔎 Informe a chave do ambiente que deseja:"
            }
        ]);
        return publicKey;
    }
    async promptApiKey() {
        if (this.vscode) {
            return this.vscode.window.showInputBox({
                prompt: "Informe a chave do operador:",
                ignoreFocusOut: true,
            });
        }
        const prompt = inquirer.createPromptModule();
        const { apiKey } = await prompt([
            {
                type: "input",
                name: "apiKey",
                message: "🔎 Informe a chave do operador:"
            }
        ]);
        return apiKey;
    }

    async promptConfirmMerge() {
        if (this.vscode) {
            return this.vscode.window.showWarningMessage(
                "ATENÇÃO !\n\nInformamos que o merge prioriza os dados do maestro, portanto, se o código atual no maestro estiver desatualizado, os parses no vscode também estarão desatualizados.\nÉ importante que realize o upload antes de realizar o merge, ou marque a opção autoBuilded como true dentro do maestro.config, para realizar o upload automático.\n\nVocê confirma o merge ?",
                { modal: true },
                "Sim",
                "Não"
            );
        }
        const prompt = inquirer.createPromptModule();
        const { confirmed } = await prompt([
            {
                type: "rawlist",
                name: "confirmed",
                message: "ATENÇÃO !\n\nInformamos que o merge prioriza os dados do maestro, portanto, se o código atual no maestro estiver desatualizado, os parses no vscode também estarão desatualizados.\nÉ importante que realize o upload antes de realizar o merge, ou marque a opção autoBuilded como true dentro do maestro.config, para realizar o upload automático.\n\nVocê confirma o merge ?",
                choices: [
                    {
                        name: "Sim",
                        value: "S"
                    },
                    {
                        name: "Não",
                        value: "N"
                    }
                ]
            }
        ]);
        return confirmed;
    }
}